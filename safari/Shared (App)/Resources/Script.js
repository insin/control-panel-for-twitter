// biome-ignore lint/correctness/noUnusedVariables: called by the native Safari wrapper
function show(platform, state) {
  document.body.classList.add(`platform-${platform}`)
  if (typeof state == 'string') {
    document.body.classList.toggle('state-on', state == 'on')
    document.body.classList.toggle('state-off', state == 'off')
    document.body.classList.toggle('state-error', state == 'error')
  } else if (platform == 'mac') {
    document.body.classList.add('state-unknown')
  }
}

const lang = navigator.language || 'en'
if (lang.startsWith('ja')) {
  document.body.classList.add('lang-ja')
} else {
  document.body.classList.add('lang-en')
}

document.addEventListener('click', (event) => {
  if (event.target instanceof HTMLElement && event.target.closest('button.open-preferences')) {
    //@ts-expect-error
    webkit.messageHandlers.controller.postMessage('open-preferences')
  }
})
