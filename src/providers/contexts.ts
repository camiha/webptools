import { Dispatch, SetStateAction, createContext } from "react";

type EncodeOption = {
	lossless: boolean;
	quality: number;
};

export const EncodeOptionContext = createContext<EncodeOption>({
	lossless: false,
	quality: 75,
});

export const SetEncodeOptionContext = createContext<
	Dispatch<SetStateAction<EncodeOption>>
>(() => undefined);
