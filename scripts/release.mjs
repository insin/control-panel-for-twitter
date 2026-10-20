import fs from 'node:fs'

import semver from 'semver'

import { getEdition } from './lib.mjs'

const edition = getEdition()
const manifestPaths =
  edition == 'v4'
    ? ['./manifest.v4.mv2.json', './manifest.v4.mv3.json']
    : [
        './manifest.mv2.json',
        './manifest.mv3.json',
        './safari/Shared (Extension)/Resources/manifest.json',
      ]
const safariProjectPath = './safari/Control Panel for Twitter.xcodeproj/project.pbxproj'

const releaseType = process.argv[2]

if (releaseType != 'patch' && releaseType != 'minor' && releaseType != 'major') {
  console.log(
    `
Usage:
  npm run release (patch|minor|major)
`.trim(),
  )
  process.exit(1)
}

const currentVersion = JSON.parse(fs.readFileSync(manifestPaths[0], { encoding: 'utf8' })).version
const nextVersion = semver.inc(currentVersion, releaseType)

for (const manifestPath of manifestPaths) {
  fs.writeFileSync(
    manifestPath,
    fs
      .readFileSync(manifestPath, { encoding: 'utf8' })
      .replace(/"version": "[^"]+"/, `"version": "${nextVersion}"`),
    { encoding: 'utf8' },
  )
}

if (edition == 'v5')
  fs.writeFileSync(
    safariProjectPath,
    fs
      .readFileSync(safariProjectPath, { encoding: 'utf8' })
      .replace(
        /CURRENT_PROJECT_VERSION = (\d+)/g,
        (_, current) => `CURRENT_PROJECT_VERSION = ${Number(current) + 1}`,
      )
      .replace(/MARKETING_VERSION = [^;]+/g, `MARKETING_VERSION = ${nextVersion}`),
    { encoding: 'utf8' },
  )

console.log(`Bumped to v${nextVersion}`)
