/** @type {Map<string, string[]>} */
const checkboxGroups = new Map(Object.entries({
  reduceAlgorithmicContent: [
    'alwaysUseLatestTweets',
    'hideSidebarContent',
    'hideWhoToFollowEtc',
    'hideMoreTweets',
  ],
  uiImprovements: [
    'navBaseFontSize',
    'fastBlock',
    'pinQuotedTweetOnQuoteTweetsPage',
  ],
  hideNavigation: [
    'hideExploreNav',
    'hideBookmarksNav',
    'hideListsNav',
    'hideAccountSwitcher',
    'hideMessagesDrawer',
  ]
}))

chrome.storage.local.get((storedConfig) => {
  let $form = document.querySelector('form')

  let config = {
    alwaysUseLatestTweets: true,
    fastBlock: true,
    hideAccountSwitcher: true,
    hideBookmarksNav: true,
    hideExploreNav: true,
    hideListsNav: true,
    hideMessagesDrawer: true,
    hideMoreTweets: true,
    hideSidebarContent: true,
    hideWhoToFollowEtc: true,
    navBaseFontSize: true,
    pinQuotedTweetOnQuoteTweetsPage: true,
    quoteTweets: 'ignore',
    retweets: 'separate',
    verifiedAccounts: 'ignore',
    ...storedConfig
  }

  function updateCheckboxGroups() {
    for (let [group, checkboxNames] of checkboxGroups.entries()) {
      let checkedCount = checkboxNames.filter(name => config[name]).length
      $form.elements[group].checked = checkedCount == checkboxNames.length
      $form.elements[group].indeterminate = checkedCount > 0 && checkedCount < checkboxNames.length;
    }
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

  updateCheckboxGroups()

  $form.addEventListener('change', (e) => {
    let $el = (/** @type {HTMLInputElement} */ (e.target))
    if ($el.type == 'checkbox') {
      if (checkboxGroups.has($el.name)) {
        checkboxGroups.get($el.name).forEach(checkboxName => {
          config[checkboxName] = $form.elements[checkboxName].checked = $el.checked
        })
        $el.indeterminate = false
      } else {
        config[$el.name] = $el.checked
        updateCheckboxGroups()
      }
    }
    else {
      config[$el.name] = $el.value
    }
    chrome.storage.local.set(config)
  })
})
