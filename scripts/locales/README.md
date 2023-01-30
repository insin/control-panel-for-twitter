## Updating Locales

### Get locale files from Twitter

> Tweak `html/_files.txt` and `create-js-curl-config.js` first if locales have changed.

```sh
(cd html && curl -K _files.txt)
node create-js-curl-config.js
(cd js && curl -K _files.txt)
```

### Create locale object for tweak-new-twitter.user.js

Run `node create-locales.js` to create `locales.js`.

Open it, save to format it with Prettier, then use its contents to update `tweak-new-twitter.user.js`.
