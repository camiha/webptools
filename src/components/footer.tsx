
import {
    Flex,
    Text,
    Button,
} from "@chakra-ui/react";

export const Footer = ({ onClick }: { onClick: () => void }) => {
    return (
        <Flex flexDirection={"column"} gap={2}>
            <Text textAlign={"center"}>
                drop image here. (support png, jpg only)
            </Text>
            <Flex gap={4} width={"full"}>
                <Button width={"full"} onClick={onClick}>
                    clear inputs
                </Button>
            </Flex>
        </Flex>
    )
}