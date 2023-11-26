import { EncodeOption } from "../types";
import { invoke } from "@tauri-apps/api/tauri";

export const saveConfig = async (encodeOption: EncodeOption) => {
	await invoke("save_encode_option", { encodeOption });
};

export const loadConfig = async (): Promise<EncodeOption> => {
	return await invoke<EncodeOption>("load_encode_option", {});
};
