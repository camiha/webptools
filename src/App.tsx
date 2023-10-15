import { useState } from "react";
import { useFileDnD } from "./hooks/useFileDnD";
import { emit } from '@tauri-apps/api/event'

function App() {
	const [inputPaths, setInputPaths] = useState<Set<string>>(new Set());

	useFileDnD((arg: string) => {
		if (
			!(arg.endsWith(".png") || arg.endsWith(".jpg") || arg.endsWith(".jpeg"))
		) {
			return;
		}
		setInputPaths((prev) => new Set([...prev, arg]));
		emit('front-to-back', arg);
	});

	return (
		<div className="container">
			<h1>Welcome to Tauri!</h1>
			<ul>
				{Array.from(inputPaths).map((cur) => (
					<li key={cur}>{cur}</li>
				))}
			</ul>
		</div>
	);
}

export default App;
