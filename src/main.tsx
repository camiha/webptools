import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ColorModeProvider } from "./components/header";
import { EncodeOptionProvider } from "./providers/encode-option-provider";
import { system } from "./theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<ChakraProvider value={system}>
			<ColorModeProvider>
				<EncodeOptionProvider>
					<App />
				</EncodeOptionProvider>
			</ColorModeProvider>
		</ChakraProvider>
	</React.StrictMode>,
);
