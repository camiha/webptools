import { useCallback, useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";

export type Image = {
	[key: string]: {
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
};

const replaceExtension = (path: string, ext: string) => {
	const pathArr = path.split(".");
	pathArr.pop();
	return `${pathArr.join(".")}.${ext}`;
}

const isSupportExtension = (path: string): boolean => {
	const ext = path.split(".").slice(-1)[0];
	return ["png", "jpg", "jpeg"].includes(ext);
}

export const useImageFileDrop = () => {
	const [images, setImages] = useState<Image>({});
	let cleanupCounter = 0;

	const clearImages = useCallback(() => {
		setImages({});
		cleanupCounter++;
	}, []);

	useEffect(() => {
		const unlisten = listen<string[]>("tauri://file-drop", (event) => {
			for (const inputPath of event.payload) {
				if (images[inputPath]) continue;

				const fileName = inputPath.split("/").slice(-1)[0];
				const outputPath = replaceExtension(inputPath, "webp");
				const imagePaths = {
					input_path: inputPath,
					output_path: outputPath
				}

				if (!isSupportExtension(inputPath)) {
					// console.log("not support extension", inputPath);
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
			
				invoke("convert_webp", { imagePaths }).then((info) => {
					const { input_size, output_size, message } = info as {
						input_size: number;
						output_size: number;
						message: string;
					};
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
				});
			}
		});
		return () => {
			unlisten.then((fn) => fn());
		};
	}, [cleanupCounter]);

	return { images, clearImages };
};
