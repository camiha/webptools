import { useImageFileDrop } from "./hooks/use-image-file-drop";
import {
	Divider,
	Flex,
} from "@chakra-ui/react";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { Content } from "./components/content";

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
				<Content images={images}/>
			</Flex>
			<Footer onClick={clearImages}/>
		</Flex>
	);
}

export default App;
