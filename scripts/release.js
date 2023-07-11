const fs = require('fs')

const semver = require('semver')

const manifestV2Path = './manifest.json'
const manifestV3Path = './Safari/Shared (Extension)/Resources/manifest.json'
const optionsPath = './options.js'
const safariProjectPath = './Safari/Control Panel for Twitter.xcodeproj/project.pbxproj'
const scriptPath = './script.js'

let releaseType = process.argv[2]

if (!releaseType) {
  console.log(`
Usage:
  npm run release (patch|minor|major)
`.trim())
  process.exit(1)
}

let currentVersion = JSON.parse(fs.readFileSync(manifestV2Path, {encoding: 'utf8'})).version
let nextVersion = semver.inc(currentVersion, releaseType)

for (let manifestPath of [manifestV2Path, manifestV3Path]) {
  fs.writeFileSync(
    manifestPath,
    fs.readFileSync(manifestPath, {encoding: 'utf8'})
      .replace(/"version": "[^"]+"/, `"version": "${nextVersion}"`),
    {encoding: 'utf8'}
  )
}

fs.writeFileSync(
  optionsPath,
  fs.readFileSync(optionsPath, {encoding: 'utf8'})
    .replace(/control-panel-for-twitter-.+\.config\.txt/, `control-panel-for-twitter-v${nextVersion}.config.txt`),
  {encoding: 'utf8'}
)

fs.writeFileSync(
  safariProjectPath,
  fs.readFileSync(safariProjectPath, {encoding: 'utf8'})
    .replace(/CURRENT_PROJECT_VERSION = (\d+)/g, (_, current) => `CURRENT_PROJECT_VERSION = ${Number(current) + 1}`)
    .replace(/MARKETING_VERSION = [^;]+/g, `MARKETING_VERSION = ${nextVersion}`),
  {encoding: 'utf8'}
)

fs.writeFileSync(
  scriptPath,
  fs.readFileSync(scriptPath, {encoding: 'utf8'})
    .replace(/@version     (\d+)/g, (_, current) => `@version     ${Number(current) + 1}`),
  {encoding: 'utf8'}
)

console.log(`Bumped to v${nextVersion}`)