## Updating locales

```sh
node scripts/locales/download-locales.mjs
node scripts/locales/create-locales.mjs
npx biome format --write --vcs-enabled=false scripts/locales/locales.js
```

To match a captured xweb build, pass its catalog-registry bundle URL or local file
to `download-locales.mjs`. The default `/home` request can receive a different
build from a signed-in browser. Downloaded sources are recorded in
`json/_sources.txt`.

The generator omits empty catalogs and xweb's `en-ss` diagnostic and `en-xx`
pseudo-locales.
