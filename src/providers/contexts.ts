import { Dispatch, SetStateAction, createContext } from "react";
import { EncodeOption } from "../types";

export const EncodeOptionContext = createContext<EncodeOption>({
	lossless: false,
	quality: 75,
});

export const SetEncodeOptionContext = createContext<
	Dispatch<SetStateAction<EncodeOption>>
>(() => undefined);
