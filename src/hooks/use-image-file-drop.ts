import { useCallback, useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";

export type Image = {
	[key: string]: {
		inputPath: string;
		isProgress: boolean;
		message: string;
		fileName: string;
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
					setImages((prev) => ({
						...prev,
						[inputPath]: {
							inputPath,
							fileName,
							isProgress: false,
							message: message as string,
						},
					}));
				});
			}
		});
		return () => {
			unlisten.then((fn) => fn());
		};
	}, []);

	return { images, clearImages };
};
