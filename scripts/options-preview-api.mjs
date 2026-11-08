/**
 * Install only the extension APIs used by the options/trace pages.
 * This function is serialized by the server and runs before the real page modules.
 * @param {any} window
 * @param {any} config
 */
export function installOptionsPreviewApi(window, config) {
  const clone = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)))
  const listeners = new Set()
  const storageKey = `cpft-options-preview:${config.edition}:${config.profile}`
  function parseStorage(value) {
    try {
      const data = JSON.parse(value || '{}')
      return data && typeof data == 'object' && !Array.isArray(data) ? data : {}
    } catch {
      return {}
    }
  }
  function read() {
    return parseStorage(window.localStorage.getItem(storageKey))
  }
  function changesBetween(previous, next) {
    const changes = {}
    for (const key of new Set([...Object.keys(previous), ...Object.keys(next)])) {
      if (JSON.stringify(previous[key]) == JSON.stringify(next[key])) continue
      changes[key] = {
        ...(Object.hasOwn(previous, key) ? { oldValue: previous[key] } : {}),
        ...(Object.hasOwn(next, key) ? { newValue: next[key] } : {}),
      }
    }
    return changes
  }
  function dispatch(changes) {
    if (Object.keys(changes).length) {
      for (const listener of listeners) listener(clone(changes), 'local')
    }
  }
  function write(next) {
    const previous = read()
    window.localStorage.setItem(storageKey, JSON.stringify(next))
    const changes = changesBetween(previous, read())
    window.queueMicrotask(() => dispatch(changes))
  }
  function complete(callback, value) {
    if (callback) {
      window.queueMicrotask(() => callback(clone(value)))
      return
    }
    return Promise.resolve(clone(value))
  }
  const initial = config.reset ? {} : read()
  if (!Object.hasOwn(initial, 'lastSiteVersion')) initial.lastSiteVersion = 'xweb'
  Object.assign(initial, config.overrides)
  write(initial)
  window.addEventListener('storage', (event) => {
    if (event.key != storageKey && event.key !== null) return
    dispatch(changesBetween(parseStorage(event.oldValue), parseStorage(event.newValue)))
  })

  function getURL(resource) {
    const url = new URL(resource, `${window.location.origin}/`)
    for (const [key, value] of Object.entries(config.urlParams)) {
      url.searchParams.set(key, String(value))
    }
    return url.href
  }
  function openTab(properties, callback) {
    window.open(properties.url || getURL('options.html'), '_blank', 'noopener')
    return complete(callback, { id: 1, url: properties.url, active: true, windowId: 1 })
  }
  /** @type {Record<string, any>} */
  const messages = Object.fromEntries(
    Object.entries(config.messages).map(([key, value]) => [key.toLowerCase(), value]),
  )
  const api = {
    i18n: {
      getMessage(name, substitutions = []) {
        if (name == '@@ui_locale') return config.locale
        const entry = messages[name.toLowerCase()]
        if (!entry) return ''
        const values = Array.isArray(substitutions) ? substitutions : [substitutions]
        const positional = (text) =>
          text.replace(/\$\$|\$(\d+)/g, (match, index) =>
            match == '$$' ? '$' : String(values[Number(index) - 1] ?? ''),
          )
        /** @type {Record<string, any>} */
        const placeholders = Object.fromEntries(
          Object.entries(entry.placeholders || {}).map(([key, value]) => [
            key.toLowerCase(),
            value,
          ]),
        )
        return entry.message.replace(/\$\$|\$(\d+)|\$([a-z_][\w]*)\$/gi, (match, index, key) => {
          if (match == '$$') return '$'
          if (index) return String(values[Number(index) - 1] ?? '')
          return positional(placeholders[key.toLowerCase()]?.content || '')
        })
      },
      getUILanguage: () => config.locale.replaceAll('_', '-'),
      getAcceptLanguages: (callback) =>
        complete(callback, window.navigator.languages || [config.locale.replaceAll('_', '-')]),
    },
    runtime: {
      id: 'cpft-options-preview',
      getManifest: () => clone(config.manifest),
      getURL,
      openOptionsPage: () => openTab({ url: getURL('options.html') }, undefined),
      sendMessage(message, callback) {
        if (message.type == 'GET_DEBUG_TRACE') return complete(callback, [])
        window.console.info('[options preview] Background action:', message)
        return complete(callback, undefined)
      },
    },
    storage: {
      local: {
        get(keys, callback) {
          if (typeof keys == 'function') {
            callback = keys
            keys = null
          }
          const data = read()
          let result = data
          if (typeof keys == 'string') keys = [keys]
          if (Array.isArray(keys)) {
            result = Object.fromEntries(
              keys.filter((key) => Object.hasOwn(data, key)).map((key) => [key, data[key]]),
            )
          } else if (keys != null) {
            result = Object.fromEntries(
              Object.entries(keys).map(([key, fallback]) => [
                key,
                Object.hasOwn(data, key) ? data[key] : fallback,
              ]),
            )
          }
          return complete(callback, result)
        },
        set(values, callback) {
          write({ ...read(), ...clone(values) })
          return complete(callback, undefined)
        },
        remove(keys, callback) {
          const data = read()
          for (const key of Array.isArray(keys) ? keys : [keys]) delete data[key]
          write(data)
          return complete(callback, undefined)
        },
        clear(callback) {
          write({})
          return complete(callback, undefined)
        },
      },
      onChanged: {
        addListener: (listener) => listeners.add(listener),
        removeListener: (listener) => listeners.delete(listener),
        hasListener: (listener) => listeners.has(listener),
      },
    },
    tabs: {
      create: openTab,
      query: (_query, callback) =>
        complete(callback, [{ id: 1, active: true, url: window.location.href }]),
      update: (_id, properties, callback) => openTab(properties, callback),
    },
  }
  window.chrome = api
  window.document.documentElement.lang = config.locale.replaceAll('_', '-')
  return api
}
