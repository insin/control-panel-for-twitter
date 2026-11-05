# Native context menu E2E check

Install Mozilla's Python driver into a virtual environment, then run:

```sh
python3 -m venv /tmp/cpft-e2e
/tmp/cpft-e2e/bin/pip install marionette_driver
/tmp/cpft-e2e/bin/python scripts/e2e-context-menu.py \
  --browser /Applications/Zen.app/Contents/MacOS/zen \
  --output /tmp/cpft-e2e-results
```

Use the path to your Gecko browser. The test creates a separate headless profile and a temporary extension copy with one extra localhost match. It leaves the source manifests and normal browser profile unchanged. Port 2839 must be free.

The local page cancels context-menu events at window, document, and image levels. Browser pointer actions open the real native menu. The test runs Copy Image and checks that the Gecko clipboard contains the expected image dimensions. It also checks the options page, toolbar popup, saved settings, live toggles, new images, normal clicks, and text menus.

The output folder contains `results.json`, `options.png`, and `browser.log`. A failing assertion exits with a nonzero status and saves completed checks. This checks the extension and browser together, but does not establish compatibility with the current live X page. Test a timeline image and the full photo viewer on X before release.
