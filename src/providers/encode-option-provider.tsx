import { useEffect, useState } from "react";
import { loadConfig } from "../store";
import type { EncodeOption } from "../types";
import { EncodeOptionContext, SetEncodeOptionContext } from "./contexts";

export const EncodeOptionProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [encodeOption, setEncodeOption] = useState<EncodeOption | null>(null);

	useEffect(() => {
		const load = async () => {
			const config = await loadConfig();
			setEncodeOption(config);
		};
		void load();
	}, []);

	return (
		<EncodeOptionContext.Provider value={encodeOption}>
			<SetEncodeOptionContext.Provider value={setEncodeOption}>
				{children}
			</SetEncodeOptionContext.Provider>
		</EncodeOptionContext.Provider>
	);
};
