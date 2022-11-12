let $settings = document.createElement('script')
$settings.type = 'text/json'
$settings.id = 'tnt_settings'
document.body.appendChild($settings)

chrome.storage.local.get((storedConfig) => {
  $settings.innerText = JSON.stringify(storedConfig)
  let $main = document.createElement('script')
  $main.src = chrome.runtime.getURL('tweak-new-twitter.user.js')
  $main.onload = function() {
    this.remove()
  }
  document.body.appendChild($main)
  chrome.storage.onChanged.addListener(onConfigChange)
})

function onConfigChange(changes) {
  let configChanges = Object.fromEntries(
    Object.entries(changes).map(([key, {newValue}]) => [key, newValue])
  )
  $settings.innerText = JSON.stringify(configChanges)
}

window.addEventListener('message', (event) => {
  if (event.source !== window) return
  if (event.data.type === 'tntConfigChange' && event.data.changes) {
    chrome.storage.onChanged.removeListener(onConfigChange)
    chrome.storage.local.set(event.data.changes, () => {
      chrome.storage.onChanged.addListener(onConfigChange)
    })
  }
}, false)