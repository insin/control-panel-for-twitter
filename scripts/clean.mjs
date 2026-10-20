import fs from 'node:fs'

const dryRun = process.argv.includes('--dry-run')

const mvFileRegExp = /\.mv[23]\./

for (const file of fs.readdirSync('.', { withFileTypes: true })) {
  if (file.isDirectory() || !/\.(?:mv[23]|v[45])\./.test(file.name)) continue

  const copiedFile = file.name.replace(mvFileRegExp, '.').replace(/\.v[45]\./, '.')
  if (fs.existsSync(copiedFile)) {
    if (!dryRun) {
      fs.rmSync(copiedFile)
    }
    console.log(`deleted ${copiedFile}`)
  }
}
