chrome.storage.local.get((config) => {
  let form = document.querySelector('form')

  for (let configItem in config) {
    form.elements[configItem].checked = config[configItem] || false
  }

  form.addEventListener('change', (e) => {
    config[e.target.name] = e.target.checked
    chrome.storage.local.set(config)
  })
})
