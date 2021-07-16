# Development of Tweak New Twitter

## Setup

Install development dependencies:

```shell
npm install
```

## Running as a browser extension

Tweak New Twitter uses [web-ext](https://github.com/mozilla/web-ext#web-ext) to run as a browser extension in a temporary profile, and automatically reload it when you make changes during development.

To run in Mozilla Firefox:

```shell
npm run firefox
```

To run in Google Chrome:

```shell
npm run chrome
```

To run in Microsoft Edge:

> Note: the `package.json` command for this assumes you have Windows installed on the `C:` drive

```shell
npm run edge
```

## Running as a user script

Install a [user script manager](https://greasyfork.org/en#home-step-1) of your choice and install `tweak-new-twitter.user.js` in it.

Tweak New Twitter is distributed as a browser extension and as a user script, so the main `tweak-new-twitter.user.js` script must always be valid in both contexts, even if we eventually add features which only work in the browser extension.

## Coding conventions

### Types

Tweak New Twitter is written in regular JavaScript, leveraging TypeScript's support for [type checking JavaScript files](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html) with [type annotations provided via JSDoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html), and [VS Code](https://code.visualstudio.com/)'s support for using its build-in TypeScript tooling in regular JavaScript, configured via `jsconfig.json`.

> Type checking should work out of the box if you use VS Code - if it doesn't, use the **Preference: Open Settings (JSON)** command in the Command Palette and check your global preferences for any config changes which might affect this.