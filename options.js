chrome.storage.local.get((storedConfig) => {
  let $form = document.querySelector('form')

  let config = {
    alwaysUseLatestTweets: true,
    enableDebugLogging: false,
    fastBlock: true,
    hideAccountSwitcher: true,
    hideBookmarksNav: true,
    hideExploreNav: true,
    hideListsNav: true,
    hideMessagesDrawer: true,
    hideSidebarContent: true,
    hideWhoToFollowEtc: true,
    navBaseFontSize: true,
    retweets: 'separate',
    likes: 'separate',
    ...storedConfig
  }

  for (let prop in config) {
    if (prop in $form.elements) {
      if ($form.elements[prop].type == 'checkbox') {
        $form.elements[prop].checked = config[prop]
      }
      else {
        $form.elements[prop].value = config[prop]
      }
    }
  }

  $form.addEventListener('change', (e) => {
    let $el = (/** @type {HTMLInputElement} */ (e.target))
    if ($el.type == 'checkbox') {
      config[$el.name] = $el.checked
    }
    else {
      config[$el.name] = $el.value
    }
    chrome.storage.local.set(config)
  })
})
