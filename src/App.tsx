import { Flex, Separator } from "@chakra-ui/react";
import { Content } from "./components/content";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { useImageFileDrop } from "./hooks/use-image-file-drop";

function App() {
	const { images, clearImages, openFilePicker } = useImageFileDrop();

	return (
		<Flex
			padding={4}
			flexDirection="column"
			gap={2}
			justifyContent={"space-between"}
			height={"100dvh"}
		>
			<Flex flexDirection={"column"} gap={2}>
				<Header />
				<Separator />
				<Content images={images} />
			</Flex>
			<Footer onClickReset={clearImages} onClickChooseFile={openFilePicker} />
		</Flex>
	);
}

export default App;
