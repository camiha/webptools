import {
	Button,
	Checkbox,
	Dialog,
	Field,
	NumberInput,
	VStack,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useEncodeOptionSave } from "../hooks/use-encode-option";
import {
	EncodeOptionContext,
	SetEncodeOptionContext,
} from "../providers/contexts";
import type { EncodeOption } from "../types";

export const OptionButton = () => {
	const useEncodeOption = () => useContext(EncodeOptionContext);
	const encodeOption = useEncodeOption();

	const useSetEncodeOption = () => useContext(SetEncodeOptionContext);
	const setEncodeOption = useSetEncodeOption();
	const { saveEncodeOption } = useEncodeOptionSave({
		setEncodeOption,
	});

	const [open, setOpen] = useState(false);
	const { register, handleSubmit, setValue } = useForm<EncodeOption>();

	const onSubmit: SubmitHandler<EncodeOption> = (data) => {
		saveEncodeOption({
			...data,
			quality: Number(data.quality),
			lossless: data.lossless,
			delete_original: data.delete_original,
		});
		setOpen(false);
	};

	const handleModalClose = () => {
		if (encodeOption !== null) {
			setValue("quality", encodeOption.quality);
			setValue("lossless", encodeOption.lossless);
			setValue("delete_original", encodeOption.delete_original);
		}
		setOpen(false);
	};

	return (
		<>
			<Button
				variant="outline"
				onClick={() => setOpen(true)}
				flexGrow={1}
				aria-haspopup="dialog"
			>
				options
			</Button>
			<Dialog.Root
				open={open}
				onOpenChange={(e) => {
					if (!e.open) handleModalClose();
				}}
				placement="center"
			>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content maxWidth={320}>
						<Dialog.Header>
							<Dialog.Title>encode options</Dialog.Title>
						</Dialog.Header>
						<Dialog.CloseTrigger aria-label="close without saving" />
						<form onSubmit={handleSubmit(onSubmit)}>
							<Dialog.Body>
								{encodeOption !== null && (
									<VStack gap={4}>
										<Field.Root>
											<Field.Label>quality</Field.Label>
											<NumberInput.Root
												defaultValue={String(encodeOption.quality)}
												min={0}
												max={100}
											>
												<NumberInput.Input
													{...register("quality", { required: true })}
												/>
												<NumberInput.Control>
													<NumberInput.IncrementTrigger />
													<NumberInput.DecrementTrigger />
												</NumberInput.Control>
											</NumberInput.Root>
										</Field.Root>
										<Field.Root>
											<Checkbox.Root>
												<Checkbox.HiddenInput {...register("lossless")} />
												<Checkbox.Control />
												<Checkbox.Label>using lossless option</Checkbox.Label>
											</Checkbox.Root>
										</Field.Root>
										<Field.Root>
											<Checkbox.Root>
												<Checkbox.HiddenInput
													{...register("delete_original")}
												/>
												<Checkbox.Control />
												<Checkbox.Label>delete original file</Checkbox.Label>
											</Checkbox.Root>
										</Field.Root>
									</VStack>
								)}
							</Dialog.Body>
							<Dialog.Footer>
								<Button type="submit">save</Button>
								<Button variant="outline" onClick={handleModalClose}>
									close without saving
								</Button>
							</Dialog.Footer>
						</form>
					</Dialog.Content>
				</Dialog.Positioner>
			</Dialog.Root>
		</>
	);
};
