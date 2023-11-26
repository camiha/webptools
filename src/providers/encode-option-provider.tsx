import { useEffect, useState } from "react";

import { EncodeOptionContext, SetEncodeOptionContext } from "./contexts";
import { loadConfig } from "../store";
import { EncodeOption } from "../types";

export const EncodeOptionProvider = ({
	children,
}: { children: React.ReactNode }) => {
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
