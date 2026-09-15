import { relaunch } from "@tauri-apps/plugin-process";
import { check, type Update } from "@tauri-apps/plugin-updater";
import { useCallback, useEffect, useState } from "react";

export type UpdaterStatus =
	| "idle"
	| "checking"
	| "available"
	| "downloading"
	| "failed";

export const useUpdater = () => {
	const [update, setUpdate] = useState<Update | null>(null);
	const [status, setStatus] = useState<UpdaterStatus>("idle");
	const [downloadedRate, setDownloadedRate] = useState(0);

	const checkUpdate = useCallback(async () => {
		setStatus("checking");
		try {
			const found = await check();
			setUpdate(found);
			setStatus(found === null ? "idle" : "available");
		} catch {
			setUpdate(null);
			setStatus("idle");
		}
	}, []);

	const installUpdate = useCallback(async () => {
		if (update === null) return;

		setStatus("downloading");
		setDownloadedRate(0);
		try {
			let contentLength = 0;
			let downloadedLength = 0;
			await update.downloadAndInstall((event) => {
				switch (event.event) {
					case "Started":
						contentLength = event.data.contentLength ?? 0;
						break;
					case "Progress":
						downloadedLength += event.data.chunkLength;
						setDownloadedRate(
							contentLength === 0
								? 0
								: Math.round((100 * downloadedLength) / contentLength),
						);
						break;
					case "Finished":
						setDownloadedRate(100);
						break;
				}
			});
			await relaunch();
		} catch {
			setStatus("failed");
		}
	}, [update]);

	const dismissUpdate = useCallback(() => {
		setUpdate(null);
		setStatus("idle");
	}, []);

	useEffect(() => {
		checkUpdate();
	}, [checkUpdate]);

	return { update, status, downloadedRate, installUpdate, dismissUpdate };
};
