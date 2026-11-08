## Updating locales

```sh
node scripts/locales/download-locales.mjs
node scripts/locales/create-locales.mjs
npx biome format --write --vcs-enabled=false scripts/locales/locales.js
```
