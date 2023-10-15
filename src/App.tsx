import { useState } from "react";
import { listen, emit } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api/tauri'
import { css } from "../styled-system/css";

function App() {
	const [inputPaths, setInputPaths] = useState<Set<string>>(new Set());

	listen<string[]>('tauri://file-drop', (event) => {
		setInputPaths((prev) => new Set([...prev, ...event.payload]));
		event.payload.forEach((imagePath) => {
			invoke('convert_webp', { inputPath: imagePath }).then((message) => console.log(message))
		})
	})

	return (
		<div
			className={css({
				padding: 8,
				display: "flex",
				flexDirection: "column",
				gap: 4,
			})}
		>
			<div
				className={css({
					display: "flex",
					flexDirection: "column",
					gap: 2,
				})}
			>
				<h1
					className={css({
						fontSize: "xx-large",
						fontWeight: "bold",
					})}
				>
					drop image here!
				</h1>
				<p className={css({})}>{"dnd png/jpeg => webp converter."}</p>
			</div>

			<div className={css({
				width: "100%",
				height: 0.5,
				backgroundColor: "white"
			})} />

			<div>
				<h2>files:</h2>
				<ul>
					{Array.from(inputPaths).map((cur) => (
						<li key={cur}>
							<div>{cur}</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default App;
