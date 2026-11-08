import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** @param {string} source */
export function findCatalogs(source) {
  return Object.fromEntries(
    Array.from(
      source.matchAll(
        /https:\/\/abs\.twimg\.com\/x-web\/x-web\/assets\/messages-logged-in-([a-z]+(?:-[a-z]+)*)-[\w-]{8}\.json/g,
      ),
      ([url, locale]) => [locale, url],
    ),
  )
}

/**
 * Catalog URLs live in an imported application bundle.
 * @param {string} url
 * @param {(url: string) => Promise<string>} read
 */
export async function discoverCatalogs(url, read) {
  const pending = [url]
  const visited = new Set()
  while (pending.length && visited.size < 50) {
    const current = pending.shift()
    if (visited.has(current)) continue
    visited.add(current)
    const source = await read(current)
    const catalogs = findCatalogs(source)
    if (catalogs.en) return catalogs
    const modules = [
      ...Array.from(
        source.matchAll(/https:\/\/abs\.twimg\.com\/x-web\/x-web\/[\w./-]+\.js/g),
        ([module]) => module,
      ),
      ...Array.from(
        source.matchAll(/(?:from\s*|import\s*\(\s*)['"`]([^'"`]+\.js)['"`]/g),
        ([, module]) => new URL(module, current).href,
      ),
    ]
    pending.push(...modules.filter((module) => !visited.has(module) && !pending.includes(module)))
  }
  throw new Error('Could not find the xweb logged-in catalog registry')
}

async function readUrl(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) })
  if (!response.ok) throw new Error(`${response.status}: ${url}`)
  return response.text()
}

if (process.argv[1] && path.resolve(process.argv[1]) == fileURLToPath(import.meta.url)) {
  const directory = path.dirname(fileURLToPath(import.meta.url))
  const source = process.argv[2] || 'https://x.com/home'
  const output = path.resolve(process.argv[3] || path.join(directory, 'json'))
  const catalogs = /^https?:/.test(source)
    ? await discoverCatalogs(source, readUrl)
    : findCatalogs(await fs.readFile(source, 'utf8'))
  if (!catalogs.en) throw new Error('Missing English xweb catalog URL')
  // Keep existing catalogs if any download fails
  const entries = Object.entries(catalogs)
  const downloaded = []
  for (let index = 0; index < entries.length; index += 6) {
    downloaded.push(
      ...(await Promise.all(
        entries.slice(index, index + 6).map(async ([locale, url]) => {
          const data = JSON.parse(await readUrl(url))
          if (
            !data ||
            typeof data != 'object' ||
            Array.isArray(data) ||
            Object.values(data).some((value) => typeof value != 'string')
          ) {
            throw new Error(`Invalid catalog: ${locale}`)
          }
          console.log(`Downloaded ${locale}`)
          return [locale, data]
        }),
      )),
    )
  }
  await fs.mkdir(output, { recursive: true })
  for (const [locale, data] of downloaded) {
    await fs.writeFile(path.join(output, `${locale}.json`), `${JSON.stringify(data, null, 2)}\n`)
  }
  await fs.writeFile(
    path.join(output, '_sources.txt'),
    `Source: ${source}\nDownloaded: ${new Date().toISOString()}\n\n${entries.map(([locale, url]) => `${locale}: ${url}`).join('\n')}\n`,
  )
}
