const {execSync} = require('child_process')
const path = require('path')
const fs = require('fs')

const {clean, copy} = require('./lib')

function getExtensionsProId() {
  const source = fs.readFileSync('extensions-pro-id.js', 'utf8')
  const match = source.match(/export const EXTENSIONS_PRO_ID = (\d+)/)
  if (!match) throw new Error('EXTENSIONS_PRO_ID not found in extensions-pro-id.js')
  return Number(match[1])
}

function copySettingsSchemas() {
  const extensionsProId = getExtensionsProId()
  const schemasDir = path.resolve(
    __dirname,
    '../../pro.soitis.dev/api/extension-settings-schemas',
  )

  fs.mkdirSync(schemasDir, {recursive: true})
  fs.copyFileSync('ext-shared.js', path.join(schemasDir, 'ext-shared.js'))
  fs.copyFileSync('schemas.js', path.join(schemasDir, `${extensionsProId}.js`))
  console.log(`Copied settings schemas to: ${schemasDir}`)
}

/** @type {import('./types').ManifestVersion[]} */
let manifestVersions = [2, 3]
if (process.argv[2]) {
  let manifestVersion = Number(process.argv[2])
  if (manifestVersion == 2 || manifestVersion == 3) {
    manifestVersions = [manifestVersion]
  }
}

copySettingsSchemas()

for (let manifestVersion of manifestVersions) {
  console.log(`\nBuilding MV${manifestVersion} version`)
  let manifestFile = `manifest.mv${manifestVersion}.json`
  let manifestData = require(`../${manifestFile}`)
  copy(manifestVersion)
  execSync('web-ext build', {stdio: 'inherit'})
  let renameTo = `./web-ext-artifacts/control_panel_for_twitter-${manifestData['version']}.mv${manifestVersion}.zip`
  fs.renameSync(
    `./web-ext-artifacts/control_panel_for_twitter-${manifestData['version']}.zip`,
    renameTo,
  )
  console.log('Moved to:', path.resolve(renameTo))
  clean()
}
