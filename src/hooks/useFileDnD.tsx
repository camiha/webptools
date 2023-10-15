import { useCallback, useEffect } from "react";
import { appWindow } from "@tauri-apps/api/window";
import { useState } from "react";

export const useFileDnD = () => {
	const [inputPath, setInputPath] = useState<string>("");

	const handleDnD = useCallback(async () => {
		const unlisten = await appWindow.onFileDropEvent((event) => {
			if (event.payload.type === "hover") {
				console.log("User hovering", event.payload.paths);
			} else if (event.payload.type === "drop") {
				console.log("User dropped", event.payload.paths);
				setInputPath(event.payload.paths[0]);
			} else {
				console.log("File drop cancelled");
			}
		});
		return unlisten;
	}, []);

	useEffect(() => {
		const cleanup = async () => {
			const unlisten = await handleDnD();
			return () => {
				unlisten();
			};
		};
		return () => {
			cleanup();
		};
	}, [handleDnD]);

	return {
		inputPath,
	};
};
