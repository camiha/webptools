import { Flex, Heading, IconButton, Text, Theme } from "@chakra-ui/react";
import { Moon, Sun } from "lucide-react";
import { createContext, useCallback, useContext, useState } from "react";

type ColorMode = "light" | "dark";

interface ColorModeContextValue {
	colorMode: ColorMode;
	toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue>({
	colorMode: "light",
	toggleColorMode: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

const getInitialColorMode = (): ColorMode => {
	if (typeof window !== "undefined" && window.matchMedia) {
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	}
	return "light";
};

export const ColorModeProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [colorMode, setColorMode] = useState<ColorMode>(getInitialColorMode);
	const toggleColorMode = useCallback(() => {
		setColorMode((prev) => (prev === "light" ? "dark" : "light"));
	}, []);

	return (
		<ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
			<Theme appearance={colorMode}>{children}</Theme>
		</ColorModeContext.Provider>
	);
};

export const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const isLight = colorMode === "light";

	return (
		<Flex justifyContent={"space-between"}>
			<Flex flexDirection={"column"}>
				<Heading as="h1" size="xl">
					webptools
				</Heading>
				<Text>minimal webp converter.</Text>
			</Flex>
			<IconButton
				aria-label="Toggle color mode"
				variant="ghost"
				onClick={toggleColorMode}
			>
				{isLight ? <Sun /> : <Moon />}
			</IconButton>
		</Flex>
	);
};
