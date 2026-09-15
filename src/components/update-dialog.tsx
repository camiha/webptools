import { Button, Dialog, Progress, Text, VStack } from "@chakra-ui/react";
import { useUpdater } from "../hooks/use-updater";

export const UpdateDialog = () => {
	const { update, status, downloadedRate, installUpdate, dismissUpdate } =
		useUpdater();

	const isDownloading = status === "downloading";
	const isFailed = status === "failed";
	const open =
		update !== null && (status === "available" || isDownloading || isFailed);

	return (
		<Dialog.Root
			open={open}
			onOpenChange={(e) => {
				if (!e.open && !isDownloading) dismissUpdate();
			}}
			placement="center"
		>
			<Dialog.Backdrop />
			<Dialog.Positioner>
				<Dialog.Content maxWidth={320}>
					<Dialog.Header>
						<Dialog.Title>update available</Dialog.Title>
					</Dialog.Header>
					{!isDownloading && <Dialog.CloseTrigger aria-label="close" />}
					<Dialog.Body>
						<VStack gap={4} alignItems={"stretch"}>
							<Text>version {update?.version} is available.</Text>
							{isDownloading && (
								<Progress.Root value={downloadedRate} min={0} max={100}>
									<Progress.Label>downloading...</Progress.Label>
									<Progress.Track>
										<Progress.Range />
									</Progress.Track>
									<Progress.ValueText />
								</Progress.Root>
							)}
							{isFailed && <Text role="alert">failed to install update.</Text>}
						</VStack>
					</Dialog.Body>
					<Dialog.Footer>
						<Button onClick={installUpdate} disabled={isDownloading}>
							{isFailed ? "retry" : "install and restart"}
						</Button>
						<Button
							variant="outline"
							onClick={dismissUpdate}
							disabled={isDownloading}
						>
							later
						</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Positioner>
		</Dialog.Root>
	);
};
