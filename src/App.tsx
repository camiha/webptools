import { useImageFileDrop } from "./hooks/use-image-file-drop";
import {
	Divider,
	Flex,
	Text,
	List,
	ListItem,
	Spinner,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Header } from "./components/header";
import { Footer } from "./components/footer";

function App() {
	const { images, clearImages } = useImageFileDrop();

	return (
		<Flex
			padding={4}
			flexDirection="column"
			gap={2}
			justifyContent={"space-between"}
			height={"100vh"}
		>
			<Flex flexDirection={"column"} gap={2}>
				<Header />
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
										<>
											<Flex
												flexDirection={"column"}
												justifyContent={"center"}
												alignItems={"center"}
											>
												{image.isProgress ? (
													<Spinner size="xs" />
												) : image.isFailed === true ?
													(
														<CloseIcon fontSize={"xs"} color={"red.500"} />
													) : (
														<CheckIcon fontSize={"xs"} color={"green.500"} />
													)}
											</Flex>
											{image.isProgress ? (
												<Text fontSize={"xs"}>{image.fileName}</Text>
											) : image.isFailed === true ? (
												<Text fontSize={"xs"}>{image.fileName} ({image.message})</Text>
											) : (
												<Text fontSize={"xs"}>{image.fileName}</Text>
											)}
										</>
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
			<Footer onClick={clearImages}/>
		</Flex>
	);
}

export default App;
