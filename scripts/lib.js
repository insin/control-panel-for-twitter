const fs = require('fs')

/**
 * @param {{dryRun?: boolean}} [options]
 */
function clean(options = {}) {
  let {dryRun = false} = options
  let mvFileRegExp = /\.mv[23]\./

  for (let file of fs.readdirSync('.', {withFileTypes: true})) {
    if (file.isDirectory() || !mvFileRegExp.test(file.name)) continue

    let copiedFile = file.name.replace(mvFileRegExp, '.')
    if (fs.existsSync(copiedFile)) {
      if (!dryRun) {
        fs.rmSync(copiedFile)
      }
      console.log(`deleted ${copiedFile}`)
    }
  }
}

/**
 * @param {import('./types').ManifestVersion} manifestVersion
 * @param {{dryRun?: boolean, local?: boolean}} [options]
 */
function copy(manifestVersion, options = {}) {
  let {dryRun = false} = options
  let mvFileRegExp =  new RegExp(`\\.mv${manifestVersion}\\.`)

  for (let file of fs.readdirSync('.', {withFileTypes: true})) {
    if (file.isDirectory() || !mvFileRegExp.test(file.name)) continue

    let copyTo = file.name.replace(mvFileRegExp, '.')
    if (!dryRun) {
      fs.copyFileSync(file.name, copyTo)
    }
    console.log(`copied ${file.name} → ${copyTo}`)
  }
}

/**
 * @param {Record<string, any>} obj
 */
function sortProperties(obj) {
  let entries = Object.entries(obj)
  entries.sort(([a], [b]) => {
    if (a < b) return -1
    if (a > b) return 1
    return 0
  })
  return Object.fromEntries(entries)
}

module.exports = {
  clean,
  copy,
  sortProperties,
}