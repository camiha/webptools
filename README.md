# dndwebp
minimal lossless webp converter. drug and drop supported.
![screenshot](https://raw.githubusercontent.com/camiha/dndwebp/develop/screenshot.webp)


## releases
note: code certificate not yet set.  
[releases](https://github.com/camiha/dndwebp/releases)

## self build
require:
- node.js 18+
- rust 1.7+
- tauri development environment (https://tauri.app/v1/guides/getting-started/prerequisites)

steps:
1. `pnpm install`
2. `pnpm tauri build`
3. create application file in `src-tauri/target/release/bundle/`