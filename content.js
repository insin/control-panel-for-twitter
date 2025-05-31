/** @type {HTMLScriptElement} */
let $settings

const isSafari = navigator.userAgent.includes('Safari/') && !/Chrom(e|ium)\//.test(navigator.userAgent)
const twitterBlue = 'rgb(29, 155, 240)'
const twitterLogoPath = 'M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z'
const xLogoPath = 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'

if (localStorage.cpftEnabled != 'false' && localStorage.cpftReplaceLogo != 'false') {
  if (!isSafari) {
    let $style = document.createElement('style')
    $style.id = 'cpftLoading'
    $style.textContent = `
      svg path[d="${xLogoPath}"] {
        fill: ${twitterBlue};
        d: path("${twitterLogoPath}");
      }
    `
    document.documentElement.append($style)
  } else {
    /** @type {SVGPathElement} */
    let $logoPath = document.querySelector(`svg path[d="${xLogoPath}"]`)
    if ($logoPath) {
      $logoPath.setAttribute('d', twitterLogoPath)
      $logoPath.setAttribute('fill', twitterBlue)
    }
  }
}

// Get initial config and inject it and the main script into the Twitter page
chrome.storage.local.get((/** @type {Partial<import("./types").Config>} */ storedConfig) => {
  // Update deprecated config values
  // @ts-ignore
  if (storedConfig.twitterBlueChecks == 'dim') {
    storedConfig.twitterBlueChecks = 'replace'
  }

  $settings = document.createElement('script')
  $settings.type = 'text/json'
  $settings.id = 'cpftSettings'
  document.documentElement.appendChild($settings)
  $settings.innerText = JSON.stringify(storedConfig)

  let $main = document.createElement('script')
  $main.src = chrome.runtime.getURL('script.js')
  $main.onload = function() {
    this.remove()
  }
  document.documentElement.appendChild($main)

  chrome.storage.onChanged.addListener(onConfigChange)
})

// Inject config changes from options pages into the settings <script>
function onConfigChange(changes) {
  if (changes.enabled) localStorage.cpftEnabled = changes.enabled.newValue
  if (changes.replaceLogo) localStorage.cpftReplaceLogo = changes.replaceLogo.newValue
  let configChanges = Object.fromEntries(
    Object.entries(changes).map(([key, {newValue}]) => [key, newValue])
  )
  $settings.innerText = JSON.stringify(configChanges)
}

// Store config changes sent from the injected script
window.addEventListener('message', (event) => {
  if (event.source !== window) return
  if (event.data.type === 'cpftConfigChange' && event.data.changes) {
    chrome.storage.onChanged.removeListener(onConfigChange)
    chrome.storage.local.set(event.data.changes, () => {
      chrome.storage.onChanged.addListener(onConfigChange)
    })
  }
}, false)