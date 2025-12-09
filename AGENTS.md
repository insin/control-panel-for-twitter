# Control Panel for Twitter - Agent Guidelines

## Build Commands
- `npm run build` - Build both MV2 and MV3 versions
- `npm run build-mv2` - Build Manifest V2 version only
- `npm run build-mv3` - Build Manifest V3 version only
- `make build` - Build via Makefile (both versions)

## Lint Commands
- `npm run lint-mv2` - Lint MV2 version with web-ext
- `npm run lint-mv3` - Lint MV3 version with web-ext

## Test Commands
No dedicated test framework. Use browser testing:
- `npm run firefox` - Test in Firefox
- `npm run chrome` - Test in Chrome
- `npm run edge` - Test in Edge

## Code Style Guidelines
- Use JSDoc type annotations: `/** @type {boolean} */`
- camelCase for variables and functions
- ES2022 target with NodeNext modules
- IIFE pattern: `void function() { ... }`
- Boolean flags for desktop/mobile: `/** @type {boolean} */ let desktop`
- Region comments: `//#region Default config`
- Import types from `./types`: `import("./types").Config`
- No semicolons at end of lines
- 2-space indentation</content>
<parameter name="filePath">/Volumes/Shared/code/upstream/control-panel-for-twitter/AGENTS.md