import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
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

	useEffect(() => {
		const unlisten = listen<{ paths: string[] }>(
			"tauri://drag-drop",
			(event) => {
				for (const inputPath of event.payload.paths) {
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
		);
		return () => {
			unlisten.then((fn) => fn());
		};
	}, [images, encodeOption]);

	return { images, clearImages };
};
