import { Flex, Heading, Text, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const isLight = colorMode === "light";
	const isDark = colorMode === "dark";

	return (
		<Flex justifyContent={"space-between"}>
			<Flex flexDirection={"column"}>
				<Heading as="h1" size="xl">
					webptools
				</Heading>
				<Text>minimal lossless webp converter.</Text>
			</Flex>
			{isLight && <SunIcon onClick={toggleColorMode} />}
			{isDark && <MoonIcon onClick={toggleColorMode} />}
		</Flex>
	);
};
