const fs = require('fs')

const semver = require('semver')

const manifestPaths = ['./manifest.mv2.json', './manifest.mv3.json', './Safari/Shared (Extension)/Resources/manifest.json']
const optionsJsPath = './options.js'
const optionsHtmlPath = './options.html'
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

let currentVersion = JSON.parse(fs.readFileSync(manifestPaths[0], {encoding: 'utf8'})).version
let nextVersion = semver.inc(currentVersion, releaseType)

for (let manifestPath of manifestPaths) {
  fs.writeFileSync(
    manifestPath,
    fs.readFileSync(manifestPath, {encoding: 'utf8'})
      .replace(/"version": "[^"]+"/, `"version": "${nextVersion}"`),
    {encoding: 'utf8'}
  )
}

fs.writeFileSync(
  optionsJsPath,
  fs.readFileSync(optionsJsPath, {encoding: 'utf8'})
    .replace(/control-panel-for-twitter-.+\.config\.txt/, `control-panel-for-twitter-v${nextVersion}.config.txt`),
  {encoding: 'utf8'}
)

fs.writeFileSync(
  optionsHtmlPath,
  fs.readFileSync(optionsHtmlPath, {encoding: 'utf8'})
    .replace(/id="version">[^<]+</, `id="version">v${nextVersion}<`),
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