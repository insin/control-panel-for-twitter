const fs = require('fs')

let dryRun = process.argv.includes('--dry-run')

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