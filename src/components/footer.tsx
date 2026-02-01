import { Button, Flex, Text } from "@chakra-ui/react";
import { OptionButton } from "./option-button";

export const Footer = ({
	onClickReset,
	onClickChooseFile,
}: {
	onClickReset: () => void;
	onClickChooseFile: () => void;
}) => {
	return (
		<Flex as="footer" flexDirection={"column"} gap={2}>
			<Flex alignItems={"center"} justifyContent={"center"} gap={2}>
				<Button onClick={onClickChooseFile} flexGrow={1}>
					Choose file
				</Button>
				<Text>or drop file here</Text>
			</Flex>
			<Flex gap={4}>
				<Button onClick={onClickReset} variant="outline" flexGrow={1}>
					clear inputs
				</Button>
				<OptionButton />
			</Flex>
		</Flex>
	);
};
