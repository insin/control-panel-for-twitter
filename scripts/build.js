const {execSync} = require('child_process')
const path = require('path')
const fs = require('fs')

const {clean, copy} = require('./lib')

/** @type {import('./types').ManifestVersion[]} */
let manifestVersions = [2, 3]
if (process.argv[2]) {
  let manifestVersion = Number(process.argv[2])
  if (manifestVersion == 2 || manifestVersion == 3) {
    manifestVersions = [manifestVersion]
  }
}

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