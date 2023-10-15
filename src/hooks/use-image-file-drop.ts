import { useCallback, useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";

export type Image = {
	[key: string]: {
		inputPath: string;
		isProgress: boolean;
		message: string;
		fileName: string;
		inputSize?: number;
		outputSize?: number;
	};
};

export const useImageFileDrop = () => {
	const [images, setImages] = useState<Image>({});

	const clearImages = useCallback(() => {
		setImages({});
	}, []);

	useEffect(() => {
		const unlisten = listen<string[]>("tauri://file-drop", (event) => {
			for (const inputPath of event.payload) {
				if (images[inputPath]) continue;
				const fileName = inputPath.split("/").slice(-1)[0];

				setImages((prev) => ({
					...prev,
					[inputPath]: {
						inputPath,
						fileName,
						isProgress: true,
						message: "converting...",
					},
				}));

				invoke("convert_webp", { inputPath }).then((message) => {
					invoke("get_image_info", { inputPath }).then((info) => {
						const { input_size, output_size } = info as {
							input_size: number;
							output_size: number;
						};
						setImages((prev) => ({
							...prev,
							[inputPath]: {
								inputPath,
								fileName,
								isProgress: false,
								message: message as string,
								inputSize: input_size,
								outputSize: output_size,
							},
						}));
					});
				});
			}
		});
		return () => {
			unlisten.then((fn) => fn());
		};
	}, []);

	return { images, clearImages };
};
