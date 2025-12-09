# Individual Patches: b394747 → Current State

Generated: $(date)

## What This Contains

Individual patch files for each modified file between:
- **Base commit**: b394747 (Update README Remove screenshots)
- **Current state**: Working directory (uncommitted changes)

## Modified Files (11 patches)

### Locale Files (7 patches)
- `_locales_en_messages.json.patch` - English translations
- `_locales_es_messages.json.patch` - Spanish translations
- `_locales_fr_messages.json.patch` - French translations
- `_locales_it_messages.json.patch` - Italian translations
- `_locales_ja_messages.json.patch` - Japanese translations
- `_locales_ko_messages.json.patch` - Korean translations
- `_locales_zh_CN_messages.json.patch` - Chinese (Simplified) translations

### Core Files (4 patches)
- `background.js.patch` - Background script (storage clearing added)
- `options.html.patch` - Options page UI (Fork features, buttons moved)
- `options.js.patch` - Options page logic (event handlers)
- `package.json.patch` - Package configuration

## How to Apply

Apply all patches:
```bash
cd /path/to/control-panel-for-twitter
for patch in patches/*.patch; do
  git apply "$patch"
done
```

Apply individual patch:
```bash
git apply patches/background.js.patch
```

## New Files (Not Included)

These files don't exist in b394747, so no patches were created:
- script.js (new Fork features implementation)
- types.d.ts (new TypeScript definitions)
- scripts/create-browser-action.js (build timestamp injection)
- Makefile (new build system)
- FORK_REQUIREMENTS.md (documentation)
- deploy.sh (deployment script)

## Notes

- All patches are against commit b394747
- Empty patches were removed (files that didn't exist in b394747)
- To see what changed: `git diff b394747 --stat`
Thu Nov 20 23:00:19 CET 2025
