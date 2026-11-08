import { readdir, readFile, realpath } from 'node:fs/promises'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'

import { installOptionsPreviewApi } from './options-preview-api.mjs'

const defaultRoot = fileURLToPath(new URL('..', import.meta.url))
const assets = new Set([
  'options.js',
  'options-components.js',
  'options.css',
  'default-settings.js',
  'ext-shared.js',
  'schemas.js',
  'settings.js',
  'trace.js',
  'trace.css',
])
const styles = ['automatic', 'firefox', 'chrome', 'edge', 'mac', 'ios']

/** @param {{root?: string}} [options] */
export function createOptionsPreviewServer({ root = defaultRoot } = {}) {
  async function configuration(params, acceptLanguage) {
    const available = (await readdir(path.join(root, '_locales'), { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
    const requested = params.get('lang') || acceptLanguage?.split(',')[0]?.split(';')[0] || 'en'
    const normalized = requested.replaceAll('-', '_')
    let locale = available.find((name) => name.toLowerCase() == normalized.toLowerCase())
    locale ||= available.find(
      (name) => name.toLowerCase() == normalized.split('_')[0].toLowerCase(),
    )
    if (!locale && params.has('lang')) {
      throw Object.assign(new Error(`Unknown locale. Available: ${available.join(', ')}`), {
        status: 400,
      })
    }
    locale ||= 'en'
    const edition = params.get('edition')
    if (edition && !['v4', 'v5'].includes(edition)) {
      throw Object.assign(new Error('edition must be v4 or v5'), { status: 400 })
    }
    const manifestFile =
      edition == 'v4'
        ? 'manifest.v4.mv3.json'
        : edition == 'v5'
          ? 'manifest.mv3.json'
          : 'manifest.json'
    const manifest = JSON.parse(await readFile(path.join(root, manifestFile), 'utf8'))
    const base = JSON.parse(await readFile(path.join(root, '_locales/en/messages.json'), 'utf8'))
    const localized = JSON.parse(
      await readFile(path.join(root, `_locales/${locale}/messages.json`), 'utf8'),
    )
    const overrides = {}
    /** @type {[string, string, string[]][]} */
    const choices = [
      ['style', 'optionsStyle', styles],
      ['site', 'lastSiteVersion', ['xweb', 'rweb']],
      ['layout', 'lastLayout', ['desktop', 'mobile']],
    ]
    for (const [key, target, allowed] of choices) {
      const value = params.get(key)
      if (value == null) continue
      if (!allowed.includes(value)) {
        throw Object.assign(new Error(`${key} must be one of: ${allowed.join(', ')}`), {
          status: 400,
        })
      }
      overrides[target] = value
    }
    const profile = params.get('profile') || 'default'
    if (!/^[\w.-]{1,64}$/.test(profile)) {
      throw Object.assign(
        new Error('profile must contain 1–64 letters, digits, dots, underscores or hyphens'),
        { status: 400 },
      )
    }
    return {
      locale,
      manifest,
      messages: { ...base, ...localized },
      edition: edition || (Number(manifest.version.split('.')[0]) >= 5 ? 'v5' : 'v4'),
      profile,
      reset: params.get('reset') == '1',
      overrides,
      urlParams: Object.fromEntries(
        [...params].filter(([key]) =>
          ['lang', 'edition', 'profile', 'style', 'site', 'layout'].includes(key),
        ),
      ),
    }
  }

  return createServer(async (request, response) => {
    response.setHeader('Cache-Control', 'no-store')
    response.setHeader('X-Content-Type-Options', 'nosniff')
    try {
      if (!['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(405, { Allow: 'GET, HEAD' }).end()
        return
      }
      const url = new URL(request.url, 'http://options-preview')
      const route = decodeURIComponent(url.pathname).slice(1)
      let content
      let type
      if (route == '__preview/api.js') {
        const config = await configuration(url.searchParams, request.headers['accept-language'])
        content = `(${installOptionsPreviewApi.toString()})(window, ${JSON.stringify(config)});\n`
        type = 'text/javascript; charset=utf-8'
      } else if (['', 'options.html', 'browser_action.html', 'trace.html'].includes(route)) {
        // Validate query parameters before returning the page as well as the shim
        await configuration(url.searchParams, request.headers['accept-language'])
        const source = route == 'trace.html' ? 'trace.html' : 'options.html'
        content = await readFile(path.join(root, source), 'utf8')
        if (route == 'browser_action.html')
          content = content.replace('<body>', '<body class="browserAction">')
        const shim = `/__preview/api.js${url.search}`
          .replaceAll('&', '&amp;')
          .replaceAll('"', '&quot;')
          .replaceAll('<', '&lt;')
        content = content.replace('<head>', `<head>\n<script src="${shim}"></script>`)
        type = 'text/html; charset=utf-8'
      } else if (assets.has(route)) {
        content = await readFile(path.join(root, route))
        type = route.endsWith('.css') ? 'text/css; charset=utf-8' : 'text/javascript; charset=utf-8'
      } else if (/^icons\/[\w.-]+\.(png|svg|ico)$/.test(route)) {
        const file = await realpath(path.join(root, route))
        const iconRoot = await realpath(path.join(root, 'icons'))
        if (path.dirname(file) != iconRoot)
          throw Object.assign(new Error('Not found'), { status: 404 })
        content = await readFile(file)
        type = route.endsWith('.svg')
          ? 'image/svg+xml'
          : route.endsWith('.ico')
            ? 'image/x-icon'
            : 'image/png'
      } else {
        response.writeHead(404).end('Not found')
        return
      }
      response.writeHead(200, { 'Content-Type': type })
      response.end(request.method == 'HEAD' ? undefined : content)
    } catch (error) {
      const status =
        error.status || (error.code == 'ENOENT' ? 404 : error instanceof URIError ? 400 : 500)
      if (status == 500) console.error('[options preview]', error)
      response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end(
        status == 500
          ? 'Could not load preview files'
          : status == 404
            ? 'Not found'
            : error.message,
      )
    }
  })
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href == import.meta.url) {
  const { values } = parseArgs({
    options: {
      host: { type: 'string', default: '127.0.0.1' },
      port: { type: 'string', default: '5011' },
      help: { type: 'boolean', short: 'h' },
    },
  })
  if (values.help) {
    console.log(
      'Usage: npm run dev:options -- [--host 127.0.0.1] [--port 5011]\nSee OPTIONS-PREVIEW.md for locale and layout query parameters.',
    )
  } else {
    const port = Number(values.port)
    if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('Invalid port')
    const server = createOptionsPreviewServer()
    server.on('error', (error) => {
      console.error(`[options preview] ${error.message}`)
      process.exitCode = 1
    })
    server.listen(port, values.host, () => {
      const address = /** @type {import('node:net').AddressInfo} */ (server.address())
      const host = values.host.includes(':') ? `[${values.host}]` : values.host
      console.log(
        `Options preview: http://${host}:${address.port}/\nPopup layout:    http://${host}:${address.port}/browser_action.html\nLocale example:  http://${host}:${address.port}/?lang=fr\nRead OPTIONS-PREVIEW.md for more examples. Reload to pick up source changes.`,
      )
    })
  }
}
