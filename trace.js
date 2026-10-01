import { CLEAR_DEBUG_TRACE_MESSAGE, GET_DEBUG_TRACE_MESSAGE } from './settings.js'

const title = `${chrome.i18n.getMessage('extensionName')} - Extensions Pro sync trace`
document.title = title
document.querySelector('h1').textContent = title

const $clear = document.querySelector('#clear')
const $copy = document.querySelector('#copy')
const $pause = document.querySelector('#pause')
const $refresh = document.querySelector('#refresh')
const $status = document.querySelector('#status')
const $trace = document.querySelector('#trace')

let paused = false
let lastStatus = ''

/** @param {import('./types').DebugTraceEntry[]} entries */
function formatTrace(entries) {
  const eventWidth = entries.reduce((width, entry) => Math.max(width, entry.event.length), 0)
  return entries
    .map(({ details, event, time, workerId }) => {
      const detailText = Object.keys(details).length > 0 ? ` ${JSON.stringify(details)}` : ''
      const timestamp = new Date(time).toISOString().replace('T', ' ').replace('Z', '')
      return `${timestamp} ${workerId} ${detailText ? event.padEnd(eventWidth) : event}${detailText}`
    })
    .join('\n')
}

// Async chrome.runtime.sendMessage wrapper for Firefox MV2
function sendMessage(type) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type }, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
        return
      }
      resolve(response)
    })
  })
}

async function refreshTrace(force = false) {
  if (paused && !force) return
  try {
    /** @type {import('./types').DebugTraceEntry[]} */
    const entries = await sendMessage(GET_DEBUG_TRACE_MESSAGE)
    if (!Array.isArray(entries)) {
      $status.textContent = 'Could not load trace: unexpected response from the background page'
      return
    }
    if (paused && !force) return
    const wasAtBottom = $trace.scrollTop + $trace.clientHeight >= $trace.scrollHeight - 20
    const nextText = formatTrace(entries)
    if ($trace.textContent !== nextText) {
      $trace.textContent = nextText
      if (wasAtBottom) $trace.scrollTop = $trace.scrollHeight
    }
    lastStatus = `${entries.length} events · times UTC · updated ${new Date().toLocaleTimeString()}`
    updateStatus()
  } catch (error) {
    $status.textContent = `Could not load trace: ${error.message}`
  }
}

function updateStatus() {
  $status.textContent = `${lastStatus}${paused ? ' · updates paused' : ''}`
}

//#region Main
$clear.addEventListener('click', async () => {
  try {
    await sendMessage(CLEAR_DEBUG_TRACE_MESSAGE)
    await refreshTrace(true)
  } catch (error) {
    $status.textContent = `Could not clear trace: ${error.message}`
  }
})
$copy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($trace.textContent)
    $status.textContent = 'Copied'
  } catch (error) {
    $status.textContent = `Could not copy trace: ${error.message}`
  }
})
$pause.addEventListener('click', () => {
  paused = !paused
  $pause.textContent = paused ? 'Resume updates' : 'Pause updates'
  $pause.setAttribute('aria-pressed', String(paused))
  updateStatus()
  if (!paused) void refreshTrace()
})
$refresh.addEventListener('click', () => refreshTrace(true))

await refreshTrace()
setInterval(refreshTrace, 3000)
//#endregion
