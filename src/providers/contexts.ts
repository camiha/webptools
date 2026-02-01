import { createContext, type Dispatch, type SetStateAction } from "react";
import type { EncodeOption } from "../types";

export const EncodeOptionContext = createContext<EncodeOption | null>(null);

export const SetEncodeOptionContext = createContext<
	Dispatch<SetStateAction<EncodeOption | null>>
>(() => undefined);
