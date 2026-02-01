import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { open } from "@tauri-apps/plugin-dialog";
import { useCallback, useContext, useEffect, useState } from "react";
import { EncodeOptionContext } from "../providers/contexts";
import { isSupportExtension, replaceExtension } from "../utils";

export type ImageItem = {
	inputPath: string;
	outputPath: string;
	isProgress: boolean;
	message: string;
	fileName: string;
	inputSize?: number;
	outputSize?: number;
	reductionRate?: number;
	isFailed: boolean;
};

export type Image = {
	[key: string]: ImageItem;
};

export const useImageFileDrop = () => {
	const [images, setImages] = useState<Image>({});

	const useEncodeOption = () => useContext(EncodeOptionContext);
	const encodeOption = useEncodeOption();

	let _cleanupCounter = 0;
	const clearImages = useCallback(() => {
		setImages({});
		_cleanupCounter++;
	}, []);

	const processFiles = useCallback(
		async (paths: string[]) => {
			const expandedPaths = await invoke<string[]>("expand_paths", {
				paths,
			});
			for (const inputPath of expandedPaths) {
				if (images[inputPath]) continue;

				const fileName = inputPath.split("/").slice(-1)[0];
				const outputPath = replaceExtension(inputPath, "webp");
				const imageInputInfo = {
					input_path: inputPath,
					output_path: outputPath,
				};

				if (!isSupportExtension(inputPath)) {
					setImages((prev) => ({
						...prev,
						[inputPath]: {
							inputPath,
							outputPath,
							fileName,
							isProgress: false,
							isFailed: true,
							message: "unsupport extension",
						},
					}));
					continue;
				}

				setImages((prev) => ({
					...prev,
					[inputPath]: {
						inputPath,
						outputPath,
						fileName,
						isProgress: true,
						isFailed: false,
						message: "converting...",
					},
				}));

				invoke<{
					input_size: number;
					output_size: number;
					message: string;
				}>("convert_webp", { imageInputInfo, encodeOption }).then(
					({ input_size, output_size, message }) => {
						const rate = Math.round(
							(100 * (input_size - output_size)) / input_size,
						);
						const reductionRate = rate ? rate : 0;
						setImages((prev) => ({
							...prev,
							[inputPath]: {
								inputPath,
								outputPath,
								fileName,
								isProgress: false,
								isFailed: false,
								message,
								inputSize: input_size,
								outputSize: output_size,
								reductionRate,
							},
						}));
					},
				);
			}
		},
		[images, encodeOption],
	);

	const openFilePicker = useCallback(async () => {
		const selected = await open({
			multiple: true,
			directory: false,
			filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg"] }],
		});
		if (selected) {
			const paths = Array.isArray(selected) ? selected : [selected];
			await processFiles(paths);
		}
	}, [processFiles]);

	useEffect(() => {
		const unlisten = listen<{ paths: string[] }>(
			"tauri://drag-drop",
			async (event) => {
				await processFiles(event.payload.paths);
			},
		);
		return () => {
			unlisten.then((fn) => fn());
		};
	}, [processFiles]);

	return { images, clearImages, openFilePicker };
};
