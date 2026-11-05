# Copied-link verification

Run the browser test with Python and `marionette_driver` installed:

```sh
python scripts/e2e-clean-links.py --browser /Applications/Zen.app/Contents/MacOS/zen --output /tmp/cpft-clean-links-results
```

Add `--mobile` to use an Android user agent and a narrow test-page window. The runner widens the window for settings clicks. This is emulation, not a physical phone test.

The runner creates an isolated profile, loads the real extension, and adds a localhost match to the test copy only. It clicks copy buttons and reads the browser clipboard. It saves `results.json`, `options.png`, and `browser.log`. It does not use the normal browser profile.

Failure cases covered by the test, defined before implementation:

- Share parameters survive a `writeText`, `write`, or legacy copy operation.
- A site copy handler adds tracking after the selection handler runs.
- HTML links retain tracking, or lose their formatting.
- Duplicate or encoded parameter names escape removal.
- The cleaner damages photo paths, useful query values, fragments, or surrounding text.
- It changes unrelated domains or a hostname that only starts with `x.com`.
- The feature switch or extension switch fails, including after a reload.
- Clipboard changes break image copying.

For the live check, load the test ZIP through `about:debugging`, reload X, and use Share post > Copy link. Paste into a local text editor. Repeat with the setting off, then on. The enabled copy must have the same post path with no `a`, `s`, `t`, `ref_src`, or `ref_url` query fields.

Scope: copies made by the X page and selected text on X. This does not monitor the operating system clipboard, clean address-bar copies, expand `t.co`, or remove tracking from unrelated domains. Native browser Copy Link commands do not call the page clipboard APIs.
