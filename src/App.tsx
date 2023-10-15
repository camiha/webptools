import { useState } from "react";
import { useFileDnD } from "./hooks/useFileDnD";
import { emit } from "@tauri-apps/api/event";

import { css } from "../styled-system/css";

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
			emit("front-to-back", arg);
		}
	});

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
