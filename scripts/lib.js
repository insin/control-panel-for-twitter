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
      if (dryRun) {
        console.log(`rm ${copiedFile}`)
      } else {
        fs.rmSync(copiedFile)
      }
    }
  }
}

/**
 * @param {import('./types').ManifestVersion} manifestVersion
 * @param {{dryRun?: boolean}} [options]
 */
function copy(manifestVersion, options = {}) {
  let {dryRun = false} = options
  let mvFileRegExp =  new RegExp(`\\.mv${manifestVersion}\\.`)

  for (let file of fs.readdirSync('.', {withFileTypes: true})) {
    if (file.isDirectory() || !mvFileRegExp.test(file.name)) continue

    let copyTo = file.name.replace(mvFileRegExp, '.')
    if (dryRun) {
      console.log(`copy ${file.name} → ${copyTo}`)
    } else {
      fs.copyFileSync(file.name, copyTo)
    }
  }
}

/**
 * @param {Record<string, any>} locale
 */
function sortProperties(locale) {
  let entries = Object.entries(locale)
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