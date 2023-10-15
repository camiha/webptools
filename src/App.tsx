import { useImageFileDrop } from "./hooks/use-image-file-drop";
import {
	Divider,
	Flex,
	Heading,
	Text,
	List,
	ListItem,
	Spinner,
	Button,
	useColorMode,
} from "@chakra-ui/react";
import { CheckIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";

function App() {
	const { images, clearImages } = useImageFileDrop();
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<Flex
			padding={4}
			flexDirection="column"
			gap={2}
			justifyContent={"space-between"}
			height={"100vh"}
		>
			<Flex flexDirection={"column"} gap={2}>
				<Flex justifyContent={"space-between"}>
					<Flex flexDirection={"column"}>
						<Heading as="h1" size="xl">
							dndimg
						</Heading>
						<Text>minimal lossless webp converter.</Text>
					</Flex>
					{colorMode === "light" ? (
						<SunIcon onClick={toggleColorMode} />
					) : (
						<MoonIcon onClick={toggleColorMode} />
					)}
				</Flex>
				<Divider />
				<Flex flexDirection={"column"} gap={2}>
					<Heading as="h2" size="sm">
						drop image here! (support png, jpg only)
					</Heading>
					<List display="flex" flexDirection="column" gap={1}>
						{Object.entries(images).map(([key, image]) => (
							<ListItem
								key={key}
								display={"flex"}
								gap={2}
								flexDirection={"column"}
							>
								<Flex gap={2}>
									<Flex
										flexDirection={"column"}
										justifyContent={"center"}
										alignItems={"center"}
									>
										{image.isProgress ? (
											<Spinner size="sm" />
										) : (
											<CheckIcon color={"green.500"} />
										)}
									</Flex>
									<Text>{image.fileName}</Text>
								</Flex>
							</ListItem>
						))}
					</List>
				</Flex>
			</Flex>
			<Flex gap={4} width={"full"}>
				<Button width={"full"} onClick={clearImages}>
					clear inputs
				</Button>
			</Flex>
		</Flex>
	);
}

export default App;
