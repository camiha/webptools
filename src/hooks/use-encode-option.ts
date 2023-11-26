import { SetStateAction } from "react";
import { EncodeOption } from "../types";
import { saveConfig } from "../store";

export const useEncodeOptionSave = ({
	setEncodeOption,
}: {
	setEncodeOption: (value: SetStateAction<EncodeOption>) => void;
}) => {
	const saveEncodeOption = (encodeOption: EncodeOption) => {
		setEncodeOption(encodeOption);
		void saveConfig(encodeOption);
	};

	return { saveEncodeOption };
};
