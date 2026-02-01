import { invoke } from "@tauri-apps/api/core";
import type { EncodeOption } from "../types";

export const saveConfig = async (encodeOption: EncodeOption) => {
	await invoke("save_encode_option", { encodeOption });
};

export const loadConfig = async (): Promise<EncodeOption> => {
	const result = await invoke<EncodeOption>("load_encode_option", {});
	return result;
};
