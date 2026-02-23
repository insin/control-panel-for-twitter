function show(platform, enabled) {
  document.body.classList.add(`platform-${platform}`)
  if (typeof enabled == 'boolean') {
    document.body.classList.toggle('state-on', enabled)
    document.body.classList.toggle('state-off', !enabled)
  }
  else if (platform == 'mac') {
    document.body.classList.add('state-unknown')
  }
}

let lang = navigator.language || 'en'
if (lang.startsWith('ja')) {
  document.body.classList.add('lang-ja')
} else {
  document.body.classList.add('lang-en')
}

document.addEventListener('click', (event) => {
  if (event.target instanceof HTMLElement && event.target.closest('button.open-preferences')) {
    //@ts-expect-error
    webkit.messageHandlers.controller.postMessage('open-preferences');
  }
})