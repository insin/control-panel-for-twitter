# Development of Tweak New Twitter

## Setup

Install development dependencies:

```shell
npm install
```

## Debug mode

To enable debug mode, you can either manually set `debug = true` at the top of `tweak-new-twitter.user.js`, or open the options page, expand the Experiments secion and click the last paragraph 5 times to gain access to the debug options, where you can enable debug mode.

When debug mode is active, log statemente are displayed in the browser console and the detected type of each tweet is displayed in all supported tweet timelines where the tweet type is being detected.

There's a `log()` function which can and should be used to log useful debug information, such as the appearance of elements which trigger certain tweaks (useful as a starting point when Twitter changes things), or that a particular tweak is about to happen (for traceability).

## Desktop vs. mobile

At the time of writing, the [current version of Twitter](https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/buildingthenewtwitter) uses the same webapp to provide different experiences for desktop and mobile devices.

Some of the tweaks in Tweak New Twitter work the same in both versions, but others need a different implementation or CSS selector for each version, or aren't present in one of the versions at all.

To handle this, scripts in the extension have `mobile` and `desktop` flags which are used to tailor what they do according to version of Twitter being used.

### Developing mobile features

If you want to test a feature in the mobile version, use the responsive design / mobile device simulation mode in your browser's developer tools. Tweak New Twitter will automatically detect which
version is being used, and the options page will also be updated accordingly.

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

```shell
npm run edge
```

> Note: the edge command assumes you have Windows installed on the `C:` drive, change it in your local `package.json` if that's not the case

### Running on Firefox for Android

To test the mobile version on-device as an extension, you'll need an Android device with [Firefox Nightly](https://play.google.com/store/apps/details?id=org.mozilla.fenix) installed.

Follow the setup guide in web-ext's [Developing extensions for Firefox for Android](https://extensionworkshop.com/documentation/develop/developing-extensions-for-firefox-for-android/) documentation, and after connecting your device to your computer, run `adb` to get its id:

```shell
$ adb devices
List of devices attached
1a23456b       device
```

To run in Firefox Nightly, pass in your device's id like so:

```shell
npm run android -- --adb-device 1a23456b
```

If successful, you should see output similar to the following:

```
Applying config file: ./package.json
Running web extension from /path/to/tweak-new-twitter
Selected ADB device: 1a23456b
Stopping existing instances of org.mozilla.fenix...
Starting org.mozilla.fenix...
Waiting for org.mozilla.fenix Remote Debugging Server...
Make sure to enable "Remote Debugging via USB" from Settings -> Developer Tools if it is not yet enabled.
Building web extension from /path/to/tweak-new-twitter
You can connect to this Android device on TCP port 56265
Installed /data/local/tmp/web-ext-artifacts-1626656312714/tweak_new_twitter-1.234.xpi as a temporary add-on
The extension will reload if any source file changes
Press R to reload (and Ctrl-C to quit)
```

You can now open the `about:debugging` page in Firefox on your computer and click one of the "Inspect" buttons in the Tabs list to connect your local Firefox Developer Tools to that tab on your device, allowing you to view console output and inspect the DOM.

## Running as a user script

Install a [user script manager](https://greasyfork.org/en#home-step-1) of your choice and install `tweak-new-twitter.user.js` in it.

Tweak New Twitter is distributed as a browser extension and as a user script, so the main `tweak-new-twitter.user.js` script must always be valid in both contexts, even if we eventually add features which only work in the extension.

## Coding conventions

### Types

Tweak New Twitter is written in regular JavaScript, leveraging TypeScript's support for [type checking JavaScript files](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html) with [type annotations provided via JSDoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html), and [VS Code](https://code.visualstudio.com/)'s support for using its built-in TypeScript tooling in regular JavaScript, configured via `jsconfig.json`.

> Type checking should work out of the box if you use VS Code - if it doesn't, use the **Preference: Open Settings (JSON)** command in the Command Palette and check your global preferences for any config changes which might affect this.

## Common development issues

**You're making a change to how timeline elements are handled, you've tripled checked your changes for logic bugs, _and_ you've added logging which says your change is doing what it should do, so why is it not working?**

You're running 2 versions of Tweak New Twitter at the same time - the one you're developing, and an older version you already have installed.

If you're testing a quick change in a user script manager on desktop, check you don't have the extension version enabled.

If you're running a development version on Firefox Nightly and also have the extension installed for personal use, make sure the one installed from Mozilla Add-ons is disabled while developing.

Easy check: open up the "More" menu (desktop) or the slide-out menu (mobile) - if "Add muted word" is on there twice, you're definitely running 2 versions.