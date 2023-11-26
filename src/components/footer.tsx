import { Flex, Text, Button } from "@chakra-ui/react";
import { OptionButton } from "./option-button";

export const Footer = ({ onClickReset }: { onClickReset: () => void }) => {
	return (
		<Flex flexDirection={"column"} gap={2}>
			<Text textAlign={"center"}>drop image here. (support png, jpg only)</Text>
			<Flex gap={4} width={"full"}>
				<Button width={"full"} onClick={onClickReset}>
					clear inputs
				</Button>
				<OptionButton />
			</Flex>
		</Flex>
	);
};
