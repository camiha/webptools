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
				<Divider />
				<Flex flexDirection={"column"} gap={2}>
					<Flex justifyContent={"space-between"}>
						<Text>filename</Text>
						<Text>reduced rate</Text>
					</Flex>
					<List display="flex" flexDirection="column" gap={1}>
						{Object.entries(images).map(([key, image]) => (
							<ListItem
								key={key}
								display={"flex"}
								gap={2}
								flexDirection={"column"}
							>
								<Flex gap={2} justifyContent={"space-between"}>
									<Flex gap={2}>
										<Flex
											flexDirection={"column"}
											justifyContent={"center"}
											alignItems={"center"}
										>
											{image.isProgress ? (
												<Spinner size="xs" />
											) : (
												<CheckIcon fontSize={"xs"} color={"green.500"} />
											)}
										</Flex>
										<Text fontSize={"xs"}>{image.fileName}</Text>
									</Flex>
									<Text fontSize={"xs"}>
										{image.reductionRate === 0 ? "-" : image.reductionRate}%
									</Text>
								</Flex>
							</ListItem>
						))}
					</List>
				</Flex>
			</Flex>
			<Flex flexDirection={"column"} gap={2}>
				<Text textAlign={"center"}>
					drop image here. (support png, jpg only)
				</Text>
				<Flex gap={4} width={"full"}>
					<Button width={"full"} onClick={clearImages}>
						clear inputs
					</Button>
				</Flex>
			</Flex>
		</Flex>
	);
}

export default App;
