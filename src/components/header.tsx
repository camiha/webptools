
import {
	Flex,
	Heading,
	Text,
	useColorMode,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Flex justifyContent={"space-between"}>
        <Flex flexDirection={"column"}>
            <Heading as="h1" size="xl">
                dndwebp
            </Heading>
            <Text>minimal lossless webp converter.</Text>
        </Flex>
        {colorMode === "light" ? (
            <SunIcon onClick={toggleColorMode} />
        ) : (
            <MoonIcon onClick={toggleColorMode} />
        )}
    </Flex>
    )
}