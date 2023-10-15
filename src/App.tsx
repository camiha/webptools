import {  useState } from "react";
import { useFileDnD } from "./hooks/useFileDnD";
import { emit } from '@tauri-apps/api/event'

import { css } from '../styled-system/css';

function App() {
	const [inputPaths, setInputPaths] = useState<Set<string>>(new Set());

	useFileDnD((args: string[]) => {
		for (const arg of args) {
			if (
				!(arg.endsWith(".png") || arg.endsWith(".jpg") || arg.endsWith(".jpeg"))
			) {
				continue;
			}
			setInputPaths((prev) => new Set([...prev, arg]));
			emit('front-to-back', arg);
		}
	});

	return (
		<div className={css({})}>
			<h1>drop here image!</h1>
			<ul>
				{Array.from(inputPaths).map((cur) => (
					<li key={cur}>{cur}</li>
				))}
			</ul>
		</div>
	);
}

export default App;
