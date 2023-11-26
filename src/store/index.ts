import { Store } from "tauri-plugin-store-api";
import { EncodeOption } from "../types";

export const saveConfig = async (encodeOption: EncodeOption) => {
	const encodeConfig = new Store(".settings.json");
	const { lossless, quality } = encodeOption;

	await encodeConfig.set("lossless", lossless);
	await encodeConfig.set("quality", quality);
};

export const loadConfig = async (): Promise<EncodeOption> => {
	const encodeConfig = new Store(".settings.json");
	const lossless = await encodeConfig.get<boolean>("lossless");
	const quality = await encodeConfig.get<number>("quality");

	if (lossless == null || quality == null) {
		return { lossless: false, quality: 75 };
	}

	return { lossless, quality };
};
