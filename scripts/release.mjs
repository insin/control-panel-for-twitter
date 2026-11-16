import fs from 'node:fs'

import semver from 'semver'

import { getEdition } from './lib.mjs'
import { prepareSafari } from './safari.mjs'

const edition = getEdition()
const manifestPaths =
  edition == 'v4'
    ? ['./manifest.v4.mv2.json', './manifest.v4.mv3.json']
    : ['./manifest.mv2.json', './manifest.mv3.json']
const safariProjectPath = './safari/Control Panel for Twitter.xcodeproj/project.pbxproj'

const versionArg = process.argv[2]
const releaseType =
  versionArg == 'patch' || versionArg == 'minor' || versionArg == 'major' ? versionArg : null
const specificVersion = semver.parse(versionArg)

if (!releaseType && !specificVersion) {
  console.log(
    `
Usage:
  npm run release -- (patch|minor|major|<version>) [--edition=v4|v5]

Examples:
  npm run release -- 4.99.0
  npm run release -- minor --edition=v5
`.trim(),
  )
  process.exit(1)
}

const currentVersion = JSON.parse(fs.readFileSync(manifestPaths[0], { encoding: 'utf8' })).version
const nextVersion = specificVersion
  ? [specificVersion.version, specificVersion.build.join('.')].filter(Boolean).join('+')
  : semver.inc(currentVersion, releaseType)

if (edition == 'v4' && semver.major(nextVersion) != 4) {
  console.error(
    `Cannot release v4 as ${nextVersion}. Use --edition=v5 to release version 5 or later.`,
  )
  process.exit(1)
}

if (specificVersion && !semver.gt(nextVersion, currentVersion)) {
  console.error(
    `Version ${nextVersion} must be higher than the current ${edition} version ${currentVersion}`,
  )
  process.exit(1)
}

for (const manifestPath of manifestPaths) {
  fs.writeFileSync(
    manifestPath,
    fs
      .readFileSync(manifestPath, { encoding: 'utf8' })
      .replace(/"version": "[^"]+"/, `"version": "${nextVersion}"`),
    { encoding: 'utf8' },
  )
}

fs.writeFileSync(
  safariProjectPath,
  fs
    .readFileSync(safariProjectPath, { encoding: 'utf8' })
    .replace(
      /CURRENT_PROJECT_VERSION = (\d+)/g,
      (_, current) => `CURRENT_PROJECT_VERSION = ${Number(current) + 1}`,
    ),
  { encoding: 'utf8' },
)

prepareSafari({ edition })

console.log(`Bumped to v${nextVersion}`)
