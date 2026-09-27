import { CLEAR_DEBUG_TRACE_MESSAGE, GET_DEBUG_TRACE_MESSAGE } from './settings.js'

const title = `${chrome.i18n.getMessage('extensionName')} - Extensions Pro sync trace`
document.title = title
document.querySelector('h1').textContent = title

const $clear = document.querySelector('#clear')
const $copy = document.querySelector('#copy')
const $refresh = document.querySelector('#refresh')
const $status = document.querySelector('#status')
const $trace = document.querySelector('#trace')

/** @param {import('./types').DebugTraceEntry[]} entries */
function formatTrace(entries) {
  return entries
    .map(({ details, event, sequence, time, workerId }) => {
      const detailText = Object.keys(details).length > 0 ? ` ${JSON.stringify(details)}` : ''
      return `${new Date(time).toISOString()} ${workerId}:${sequence} ${event}${detailText}`
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

async function refreshTrace() {
  try {
    /** @type {import('./types').DebugTraceEntry[]} */
    const entries = await sendMessage(GET_DEBUG_TRACE_MESSAGE)
    if (!Array.isArray(entries)) {
      $status.textContent = 'Could not load trace: unexpected response from the background page'
      return
    }
    const wasAtBottom = $trace.scrollTop + $trace.clientHeight >= $trace.scrollHeight - 20
    $trace.textContent = formatTrace(entries)
    if (wasAtBottom) $trace.scrollTop = $trace.scrollHeight
    $status.textContent = `${entries.length} events · updated ${new Date().toLocaleTimeString()}`
  } catch (error) {
    $status.textContent = `Could not load trace: ${error.message}`
  }
}

//#region Main
$clear.addEventListener('click', async () => {
  try {
    await sendMessage(CLEAR_DEBUG_TRACE_MESSAGE)
    await refreshTrace()
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
$refresh.addEventListener('click', refreshTrace)

await refreshTrace()
setInterval(refreshTrace, 3000)
//#endregion
