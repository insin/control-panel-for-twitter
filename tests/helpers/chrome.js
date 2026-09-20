import { vi } from 'vitest'

function createEvent() {
  const listeners = []
  return {
    addListener: vi.fn((listener) => listeners.push(listener)),
    listeners,
  }
}

function getStoredValues(storage, keys) {
  if (keys == null) return structuredClone(storage)

  if (typeof keys == 'string') {
    return Object.hasOwn(storage, keys) ? { [keys]: structuredClone(storage[keys]) } : {}
  }

  if (Array.isArray(keys)) {
    return Object.fromEntries(
      keys
        .filter((key) => Object.hasOwn(storage, key))
        .map((key) => [key, structuredClone(storage[key])]),
    )
  }

  return Object.fromEntries(
    Object.entries(keys).map(([key, defaultValue]) => [
      key,
      Object.hasOwn(storage, key) ? structuredClone(storage[key]) : structuredClone(defaultValue),
    ]),
  )
}

function createStorageArea(storage) {
  return {
    get: vi.fn((keys, callback) => callback(getStoredValues(storage, keys))),
    remove: vi.fn((keys, callback) => {
      const keyList = Array.isArray(keys) ? keys : [keys]
      for (const key of keyList) delete storage[key]
      callback()
    }),
    set: vi.fn((values, callback) => {
      Object.assign(storage, structuredClone(values))
      callback()
    }),
  }
}

/**
 * Creates the subset of the Chrome extension API used by settings sync.
 * @param {{alarms?: Record<string, chrome.alarms.Alarm>, session?: Record<string, any>, storage?: Record<string, any>}} [initial]
 */
export function createChromeMock(initial = {}) {
  const storageData = structuredClone(initial.storage ?? {})
  const sessionData = structuredClone(initial.session ?? {})
  const alarmData = new Map(Object.entries(structuredClone(initial.alarms ?? {})))
  const alarmEvent = createEvent()
  const messageEvent = createEvent()
  const storageChangedEvent = createEvent()

  function dispatchMessage(message) {
    return new Promise((resolve, reject) => {
      let channelOpen = false
      let responded = false
      const sendResponse = (response) => {
        if (responded) return
        responded = true
        resolve(response)
      }

      try {
        for (const listener of messageEvent.listeners) {
          const result = listener(message, {}, sendResponse)
          if (result === true) channelOpen = true
        }
      } catch (error) {
        reject(error)
        return
      }

      if (!channelOpen && !responded) resolve(undefined)
    })
  }

  const chromeMock = {
    alarms: {
      clear: vi.fn(async (name) => alarmData.delete(name)),
      create: vi.fn((name, alarmInfo) => {
        alarmData.set(name, { name, ...structuredClone(alarmInfo) })
      }),
      get: vi.fn(async (name) => structuredClone(alarmData.get(name))),
      onAlarm: alarmEvent,
    },
    runtime: {
      lastError: undefined,
      onMessage: messageEvent,
      sendMessage: vi.fn(dispatchMessage),
    },
    storage: {
      local: createStorageArea(storageData),
      onChanged: storageChangedEvent,
      session: createStorageArea(sessionData),
    },
    tabs: {
      create: vi.fn(),
    },
  }

  return {
    alarms: alarmData,
    chrome: chromeMock,
    async fireAlarm(name) {
      const alarm = alarmData.get(name) ?? { name }
      for (const listener of alarmEvent.listeners) listener(alarm)
      await Promise.resolve()
    },
    session: sessionData,
    sendMessage: dispatchMessage,
    storage: storageData,
  }
}
