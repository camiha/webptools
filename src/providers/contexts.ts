import { Dispatch, SetStateAction, createContext } from "react";

type EncodeOption = {
	lossless: boolean;
	quality: number;
};

export const EncodeOptionContext = createContext<EncodeOption | null>(null);

export const SetEncodeOptionContext = createContext<
	Dispatch<SetStateAction<EncodeOption | null>>
>(() => undefined);
