const MAX_TRACE_ENTRIES = 200
const TRACE_KEY = 'debugTrace'

const workerId = Array.from(crypto.getRandomValues(new Uint8Array(3)), (byte) =>
  byte.toString(16).padStart(2, '0'),
).join('')

let sequence = 0
let traceWrite = Promise.resolve()

//#region Async chrome.storage.session wrappers for Firefox MV2
function readSessionStorage(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.session.get(keys, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(result)
      }
    })
  })
}

function removeSessionStorage(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.session.remove(keys, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(undefined)
      }
    })
  })
}

function writeSessionStorage(values) {
  return new Promise((resolve, reject) => {
    chrome.storage.session.set(values, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(undefined)
      }
    })
  })
}
//#endregion

/** @returns {Promise<import('./types').DebugTraceEntry[]>} */
async function readTrace() {
  const { [TRACE_KEY]: entries = [] } = await readSessionStorage(TRACE_KEY)
  return Array.isArray(entries) ? entries : []
}

function reportTraceError(error) {
  console.warn('[trace-background]', error)
}

//#region Public API
export function clearTrace() {
  traceWrite = traceWrite.then(() => removeSessionStorage(TRACE_KEY)).catch(reportTraceError)
  return traceWrite
}

export async function getTrace() {
  await traceWrite
  try {
    return await readTrace()
  } catch (error) {
    reportTraceError(error)
    return []
  }
}

export function trace(event, details = {}) {
  const entry = {
    details,
    event,
    sequence: ++sequence,
    time: Date.now(),
    workerId,
  }

  traceWrite = traceWrite
    .then(async () => {
      const entries = await readTrace()
      entries.push(entry)
      await writeSessionStorage({ [TRACE_KEY]: entries.slice(-MAX_TRACE_ENTRIES) })
    })
    .catch(reportTraceError)

  return traceWrite
}
//#endregion
