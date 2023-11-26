# webptools
minimal webp converter.   
![screenshot](https://github.com/camiha/webptools/assets/65489256/ca0daff5-11ed-4029-b62f-1565da03f93c)

## Feature
- convert png/jpg to webp.
- support drag and drop file input.
- support encode options. (quality, lossless)
- delete original file when complete encode.
- toggle dark/light mode theme.

## Releases
note: code certificate not yet set.  
[releases](https://github.com/camiha/webptools/releases)

## Todo
- support directory input.
- using libvips.
- refactor error handlings.
- add advanced options.
- add tests.

## Self build
require:
- node.js 18+
- rust 1.7+
- tauri development environment (https://tauri.app/v1/guides/getting-started/prerequisites)

steps:
1. `pnpm install`
2. `pnpm tauri build`
3. create application file in `src-tauri/target/release/bundle/`
