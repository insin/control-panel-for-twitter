const mobile = navigator.platform == 'Android'
const desktop = !mobile
document.body.classList.add(mobile ? 'mobile' : 'desktop')

/** @type {Map<string, string[]>} */
const checkboxGroups = new Map(Object.entries({
  reduceAlgorithmicContent: [
    'alwaysUseLatestTweets',
    'hideMoreTweets',
    'hideWhoToFollowEtc',
    desktop && 'hideSidebarContent',
  ].filter(Boolean),
  uiImprovements: [
    'fastBlock',
    'pinQuotedTweetOnQuoteTweetsPage',
    desktop && 'navBaseFontSize',
    mobile && 'focusSearchOnExplorePage',
    mobile && 'hideOpenAppButton',
  ].filter(Boolean),
  hideNavigation: [
    'hideBookmarksNav',
    'hideListsNav',
    desktop && 'hideAccountSwitcher',
    desktop && 'hideExploreNav',
    desktop && 'hideMessagesDrawer',
    mobile && 'hideAnalyticsNav',
    mobile && 'hideMessagesNav',
    mobile && 'hideMomentsNav',
    mobile && 'hideNewslettersNav',
    mobile && 'hideTopicsNav',
    mobile && 'hideTwitterAdsNav',
  ].filter(Boolean)
}))

chrome.storage.local.get((storedConfig) => {
  let $form = document.querySelector('form')

  let config = {
    // Shared
    alwaysUseLatestTweets: true,
    fastBlock: true,
    hideBookmarksNav: true,
    hideListsNav: false,
    hideMoreTweets: true,
    hideWhoToFollowEtc: true,
    pinQuotedTweetOnQuoteTweetsPage: true,
    quoteTweets: 'ignore',
    retweets: 'separate',
    verifiedAccounts: 'ignore',
    // Desktop only
    hideAccountSwitcher: true,
    hideExploreNav: true,
    hideMessagesDrawer: true,
    hideSidebarContent: true,
    navBaseFontSize: true,
    // Mobile only
    focusSearchOnExplorePage: true,
    hideAnalyticsNav: true,
    hideTwitterAdsNav: true,
    hideMessagesNav: false,
    hideMomentsNav: true,
    hideNewslettersNav: true,
    hideOpenAppButton: true,
    hideTopicsNav: true,
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
