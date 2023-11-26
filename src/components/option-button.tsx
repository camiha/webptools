import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	useDisclosure,
	FormControl,
	FormLabel,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
} from "@chakra-ui/react";

import { SubmitHandler, useForm } from "react-hook-form";
import {
	EncodeOptionContext,
	SetEncodeOptionContext,
} from "../providers/contexts";
import { useContext } from "react";
import { EncodeOption } from "../types";
import { useEncodeOptionSave } from "../hooks/use-encode-option";

export const OptionButton = () => {
	const useEncodeOption = () => useContext(EncodeOptionContext);
	const encodeOption = useEncodeOption();

	const useSetEncodeOption = () => useContext(SetEncodeOptionContext);
	const setEncodeOption = useSetEncodeOption();
	const { saveEncodeOption } = useEncodeOptionSave({
		setEncodeOption,
	});

	const { isOpen, onOpen, onClose } = useDisclosure();
	const { register, handleSubmit } = useForm<EncodeOption>();

	const onSubmit: SubmitHandler<EncodeOption> = (data) => {
		saveEncodeOption({
			...data,
			quality: Number(data.quality),
			lossless: false,
		});
		onClose();
	};

	return (
		<>
			<Button width={"full"} onClick={onOpen}>
				options
			</Button>
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent maxWidth={320}>
					<ModalHeader>encode options</ModalHeader>
					<ModalCloseButton />
					<form onSubmit={handleSubmit(onSubmit)}>
						<ModalBody>
							{encodeOption !== null && (
								<FormControl>
									<FormLabel>quality</FormLabel>
									<NumberInput
										defaultValue={encodeOption.quality}
										min={0}
										max={100}
									>
										<NumberInputField
											{...register("quality", { required: true })}
										/>
										<NumberInputStepper>
											<NumberIncrementStepper />
											<NumberDecrementStepper />
										</NumberInputStepper>
									</NumberInput>
								</FormControl>
							)}
						</ModalBody>
						<ModalFooter>
							<Button type="submit" colorScheme="blue" mr={3}>
								save
							</Button>
							<Button variant="ghost" onClick={onClose}>
								close
							</Button>
						</ModalFooter>
					</form>
				</ModalContent>
			</Modal>
		</>
	);
};
