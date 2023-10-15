import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";

type Image = {
	[key: string]: { inputPath: string; isProgress: boolean; message: string };
};

function App() {
	const [images, setImages] = useState<Image>({});

	useEffect(() => {
		const unlisten = listen<string[]>("tauri://file-drop", (event) => {
			for (const inputPath of event.payload) {
				if (images[inputPath]) continue;

				setImages((prev) => ({
					...prev,
					[inputPath]: {
						inputPath,
						isProgress: true,
						message: "converting...",
					},
				}));

				invoke("convert_webp", { inputPath }).then((message) => {
					setImages((prev) => ({
						...prev,
						[inputPath]: {
							inputPath,
							isProgress: false,
							message: message as string,
						},
					}));
				});
			}
		});
		return () => {
			unlisten.then((fn) => fn());
		};
	}, []);

	return (
		<div>
			<div>
				<h1>drop image here!</h1>
				<p>{"dnd png/jpeg => webp converter."}</p>
			</div>

			<div />

			<div>
				<h2>files:</h2>
				<ul>
					{Object.entries(images).map(([key, image]) => (
						<li key={key}>
							<div>{image.inputPath}</div>
							<div>{image.isProgress}</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default App;
