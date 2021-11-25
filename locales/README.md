## Updating Locales

Tweak `html/_files.txt` if needed to add new locales.

In `html/` run `curl -K _files.txt` to retrieve HTML from Twitter with the latest URLs for hashed locale files.

Use the contents of the HTML files to update `js/_files.txt` - left as an exercise for the reader.

In `js/` run `curl -K _files.txt` to retrieve locale files.

Run `node create-locales.js` to create a `locales.js` file and use it to update `tweak-new-twitter.user.js`.
