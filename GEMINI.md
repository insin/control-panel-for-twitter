# Control Panel for Twitter (X) - Project Overview for Gemini

This document provides an overview of the "Control Panel for Twitter" project, designed to serve as contextual information for future interactions with the Gemini AI.

## Project Overview

"Control Panel for Twitter" is a browser extension aimed at customizing and enhancing the user experience on Twitter (now X). It offers a suite of options to modify the user interface, hide undesirable elements, and alter platform behavior, ultimately providing users with greater control over their browsing experience. The project supports both Manifest V2 and Manifest V3 of browser extensions, ensuring broad compatibility across various browser environments, including Firefox, Chrome, and Edge, on both desktop and Android platforms.

## Main Technologies

*   **JavaScript:** Forms the core logic for content scripts, background processes, and the options configuration page.
*   **HTML/CSS:** Utilized for structuring the options page and styling both the extension's UI and potentially injected elements on Twitter itself.
*   **Web Extension APIs:** Leverages browser-specific APIs such as `chrome.storage`, `chrome.i18n`, `chrome.runtime`, and `chrome.action`/`chrome.browserAction` to manage extension functionality, internationalization, and user interactions.
*   **Node.js:** Powers various build and release scripts, as defined in `package.json`.
*   **`web-ext`:** A command-line tool from Mozilla used for developing, running, and testing web extensions across different browsers.

## Architecture

The extension employs a standard browser extension architecture:

*   **`manifest.json`:** This file (dynamically generated for MV2 or MV3) is central to the extension, defining its metadata, required permissions, content scripts (which interact with Twitter pages), background scripts (for persistent tasks), and the options page.
*   **`background.js`:** Operates in the background, handling browser events, maintaining the extension's state, and updating the toolbar icon to reflect the extension's status.
*   **`content.js`:** Injected into Twitter pages, this script serves to inject configuration settings and the main functional script (`script.js`). It also facilitates communication between the injected `script.js` and the extension's background script, allowing for dynamic updates based on user preferences.
*   **`options.html`, `options.js`, `options.css`:** These files collectively form the user interface where users can configure the extension's various settings.
*   **`script.js`:** This is the primary script, injected directly into Twitter pages. It performs the actual Document Object Model (DOM) manipulations and implements the core features and customizations dictated by the user's settings.
*   **Localization (`_locales/`):** The project includes support for multiple languages, ensuring the extension's user interface can be localized.

## Building and Running

The project utilizes `npm` scripts and a `Makefile` for various development and build tasks:

*   **`npm install`**: Installs all necessary project dependencies.
*   **`npm run build`**: Compiles both Manifest V2 and Manifest V3 versions of the extension.
*   **`npm run build-mv2`**: Builds only the Manifest V2 compliant version.
*   **`npm run build-mv3`**: Builds only the Manifest V3 compliant version.
*   **`npm run firefox`**: Launches the Manifest V2 version of the extension in Firefox for testing and development.
*   **`npm run chrome`**: Launches the Manifest V3 version of the extension in Chrome for testing and development.
*   **`npm run edge`**: Launches the Manifest V3 version in Microsoft Edge (Windows).
*   **`npm run edge-mac`**: Launches the Manifest V3 version in Microsoft Edge (macOS).
*   **`npm run android`**: Runs the Manifest V2 version in Firefox for Android.
*   **`make build`**: An alias for `npm run build`.
*   **`make install`**: Executes a build and then deploys the extension using the `deploy.sh` script.
*   **`make deploy`**: Deploys the currently built extension using `deploy.sh`.
*   **`make clean`**: Removes all generated build artifacts.

## Development Conventions

*   **TypeScript/JSDoc:** Type hinting is implemented using JSDoc comments (`@type`) and a `types.d.ts` file, aiding in code clarity and maintainability.
*   **Linting:** The `web-ext lint` tool is integrated into the build process (`npm run lint-mv2`, `npm run lint-mv3`) to ensure code quality and adherence to web extension best practices.
*   **Localization:** Internationalization is handled through `chrome.i18n.getMessage`, supporting multiple languages for the extension's UI elements.
*   **Configuration Management:** User settings are persistently stored and retrieved using `chrome.storage.local`.
