# Development of Control Panel for Twitter

## Debug mode

To enable debug mode, you can either manually set `debug = true` at the top of `script.js`, or open the options page and click the version number at the bottom 5 times to view debug options, where you can enable debug mode.

When debug mode is active, log statemente are displayed in the browser console and the detected type of each tweet is displayed in all supported timelines where the tweet type is being detected.

There's a `log()` function which can and should be used to log useful debug information, such as the appearance of elements which trigger certain tweaks (useful as a starting point when Twitter changes things), or that a particular tweak is about to happen (for traceability).

## Desktop vs. mobile

At the time of writing, the [current version of Twitter](https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/buildingthenewtwitter) uses the same webapp to provide different experiences for desktop and mobile devices.

Some of the tweaks in Control Panel for Twitter work the same in both versions, but others need a different implementation or CSS selector for each version, or aren't present in one of the versions at all.

To handle this, scripts in the extension have `mobile` and `desktop` flags which are used to tailor what they do according to version of Twitter being used.

### Developing mobile features

If you want to test a feature in the mobile version, use the responsive design / mobile device simulation mode in your browser's developer tools. Control Panel for Twitter will automatically detect which version is being used, and the options page will also be updated accordingly the next time you open it.

## Coding conventions

### Types

Control Panel for Twitter is written in regular JavaScript, leveraging TypeScript's support for [type checking JavaScript files](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html) with [type annotations provided via JSDoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html), and [VS Code](https://code.visualstudio.com/)'s support for using its built-in TypeScript tooling in regular JavaScript, configured via `jsconfig.json`.

> Type checking should work out of the box if you use VS Code - if it doesn't, use the **Preference: Open Settings (JSON)** command in the Command Palette and check your global preferences for any config changes which might affect this.