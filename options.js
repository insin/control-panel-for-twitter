chrome.storage.local.get((storedConfig) => {
  let form = document.querySelector('form')

  let config = {
    alwaysUseLatestTweets: true,
    enableDebugLogging: false,
    hideBookmarksNav: true,
    hideExploreNav: true,
    hideListsNav: true,
    hideSidebarContent: true,
    navBaseFontSize: true,
    retweets: 'separate',
    ...storedConfig
  }

  for (let prop in config) {
    if (prop in form.elements) {
      let type = form.elements[prop].type
      if (form.elements[prop].type == 'checkbox') {
        form.elements[prop].checked = config[prop]
      }
      else {
        form.elements[prop].value = config[prop]
      }
    }
  }

  form.addEventListener('change', (e) => {
    let type = e.target.type
    if (type == 'checkbox') {
      config[e.target.name] = e.target.checked
    }
    else {
      config[e.target.name] = e.target.value
    }
    chrome.storage.local.set(config)
  })
})
