chrome.storage.local.get((storedConfig) => {
  let form = document.querySelector('form')

  let config = {
    alwaysUseLatestTweets: true,
    enableDebugLogging: false,
    hideBookmarksNav: true,
    hideExploreNav: true,
    hideListsNav: true,
    hideRetweets: true,
    hideSidebarContent: true,
    navBaseFontSize: true,
    ...storedConfig
  }

  for (let prop in config) {
    if (prop in form.elements) {
      form.elements[prop].checked = config[prop]
    }
  }

  form.addEventListener('change', (e) => {
    config[e.target.name] = e.target.checked
    chrome.storage.local.set(config)
  })
})
