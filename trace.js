import { CLEAR_DEBUG_TRACE_MESSAGE, GET_DEBUG_TRACE_MESSAGE } from './settings.js'

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

async function refreshTrace() {
  try {
    /** @type {import('./types').DebugTraceEntry[]} */
    const entries = await chrome.runtime.sendMessage({ type: GET_DEBUG_TRACE_MESSAGE })
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
  await chrome.runtime.sendMessage({ type: CLEAR_DEBUG_TRACE_MESSAGE })
  await refreshTrace()
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
