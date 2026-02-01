import type { SetStateAction } from "react";
import { saveConfig } from "../store";
import type { EncodeOption } from "../types";

export const useEncodeOptionSave = ({
	setEncodeOption,
}: {
	setEncodeOption: (value: SetStateAction<EncodeOption | null>) => void;
}) => {
	const saveEncodeOption = (encodeOption: EncodeOption) => {
		setEncodeOption(encodeOption);
		void saveConfig(encodeOption);
	};

	return { saveEncodeOption };
};
