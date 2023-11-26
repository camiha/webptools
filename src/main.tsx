import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import App from "./App";
import theme from "./theme";
import { EncodeOptionProvider } from "./providers/encode-option-provider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<ChakraProvider theme={theme}>
			<ColorModeScript initialColorMode={theme.config.initialColorMode} />
			<EncodeOptionProvider>
				<App />
			</EncodeOptionProvider>
		</ChakraProvider>
	</React.StrictMode>,
);
