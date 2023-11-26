import { useState } from "react";

import { EncodeOptionContext, SetEncodeOptionContext } from "./contexts";

export const EncodeOptionProvider = ({
	children,
}: { children: React.ReactNode }) => {
	const [encodeOption, setEncodeOption] = useState({
		lossless: false,
		quality: 75,
	});

	return (
		<EncodeOptionContext.Provider value={encodeOption}>
			<SetEncodeOptionContext.Provider value={setEncodeOption}>
				{children}
			</SetEncodeOptionContext.Provider>
		</EncodeOptionContext.Provider>
	);
};
