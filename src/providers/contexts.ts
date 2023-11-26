import { Dispatch, SetStateAction, createContext } from "react";
import { EncodeOption } from "../types";

export const EncodeOptionContext = createContext<EncodeOption | null>(null);

export const SetEncodeOptionContext = createContext<
	Dispatch<SetStateAction<EncodeOption | null>>
>(() => undefined);
