import { Box, Flex, List, Spinner, Text } from "@chakra-ui/react";
import { Check, X } from "lucide-react";
import type { Image, ImageItem } from "../hooks/use-image-file-drop";

const ContentItem = ({ image }: { image: ImageItem }) => {
	return (
		<List.Item display={"flex"} gap={2} flexDirection={"column"}>
			<Flex gap={2} justifyContent={"space-between"}>
				<Flex gap={2}>
					<Flex
						flexDirection={"column"}
						justifyContent={"center"}
						alignItems={"center"}
					>
						{image.isProgress ? (
							<Spinner size="xs" aria-label="converting" />
						) : image.isFailed === true ? (
							<Box color="red.500" aria-label="failed" role="img">
								<X size={12} />
							</Box>
						) : (
							<Box color="green.500" aria-label="completed" role="img">
								<Check size={12} />
							</Box>
						)}
					</Flex>
					{image.isProgress ? (
						<Text fontSize={"xs"}>{image.fileName}</Text>
					) : image.isFailed === true ? (
						<Text fontSize={"xs"}>
							{image.fileName} ({image.message})
						</Text>
					) : (
						<Text fontSize={"xs"}>{image.fileName}</Text>
					)}
				</Flex>
				<Text fontSize={"xs"}>
					{image.reductionRate === 0 ? "-" : image.reductionRate}%
				</Text>
			</Flex>
		</List.Item>
	);
};

export const Content = ({ images }: { images: Image }) => {
	return (
		<Flex flexDirection={"column"} gap={2}>
			<Flex justifyContent={"space-between"}>
				<Text>filename</Text>
				<Text>reduced rate</Text>
			</Flex>
			<List.Root
				display="flex"
				flexDirection="column"
				gap={1}
				aria-live="polite"
			>
				{Object.entries(images).map(([key, image]) => (
					<ContentItem key={key} image={image} />
				))}
			</List.Root>
		</Flex>
	);
};
