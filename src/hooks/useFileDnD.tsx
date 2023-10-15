import { useCallback, useEffect } from "react";
import { appWindow } from "@tauri-apps/api/window";

export const useFileDnD = (callback: (arg: string) => void) => {
	const handleDnD = useCallback(async () => {
		const unlisten = await appWindow.onFileDropEvent((event) => {
			if (event.payload.type === "drop") {
				callback(event.payload.paths[0]);
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
};
