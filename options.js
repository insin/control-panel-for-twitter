const mobile = navigator.userAgent.includes('Android')
const desktop = !mobile
document.body.classList.add(mobile ? 'mobile' : 'desktop')
document.querySelectorAll(mobile ? '.desktop' : '.mobile').forEach($el => $el.remove())

/** @type {Map<string, string[]>} */
const checkboxGroups = new Map(Object.entries({
  reduceAlgorithmicContent: [
    'alwaysUseLatestTweets',
    'hideMoreTweets',
    'hideWhoToFollowEtc',
    desktop && 'hideSidebarContent',
    mobile && 'hideExplorePageContents',
  ].filter(Boolean),
  uiImprovements: [
    'addAddMutedWordMenuItem',
    'fastBlock',
    'tweakQuoteTweetsPage',
    desktop && 'navBaseFontSize',
    mobile && 'hideAppNags',
  ].filter(Boolean),
  hideUnusedUiItems: [
    'hideShareTweetButton',
    'hideTweetAnalyticsLinks',
    desktop && 'hideAccountSwitcher',
    desktop && 'hideBookmarksNav',
    desktop && 'hideExploreNav',
    desktop && 'hideListsNav',
    desktop && 'hideMessagesDrawer',
    mobile && 'hideMessagesBottomNavItem',
  ].filter(Boolean),
  hideMoreSlideOutMenuItems: [
    'hideAnalyticsNav',
    'hideMomentsNav',
    'hideNewslettersNav',
    'hideTopicsNav',
    'hideTwitterAdsNav',
    mobile && 'hideBookmarksNav',
    mobile && 'hideListsNav',
  ].filter(Boolean),
}))

chrome.storage.local.get((storedConfig) => {
  let $form = document.querySelector('form')

  /**
   * @type {import("./types").Config}
   */
  let config = {
    // Shared
    addAddMutedWordMenuItem: true,
    alwaysUseLatestTweets: true,
    fastBlock: true,
    hideAnalyticsNav: true,
    hideBookmarksNav: true,
    hideListsNav: true,
    hideMomentsNav: true,
    hideMoreTweets: true,
    hideNewslettersNav: true,
    hideShareTweetButton: false,
    hideTopicsNav: true,
    hideTweetAnalyticsLinks: false,
    hideTwitterAdsNav: true,
    hideWhoToFollowEtc: true,
    likedTweets: 'hide',
    quoteTweets: 'ignore',
    repliedToTweets: 'hide',
    retweets: 'separate',
    tweakQuoteTweetsPage: true,
    // Experiments
    hideMetrics: false,
    reducedInteractionMode: false,
    verifiedAccounts: 'ignore',
    // Desktop only
    hideAccountSwitcher: true,
    hideExploreNav: true,
    hideMessagesDrawer: true,
    hideSidebarContent: true,
    navBaseFontSize: true,
    // Mobile only
    hideAppNags: true,
    hideExplorePageContents: true,
    hideMessagesBottomNavItem: false,
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

  document.body.classList.toggle('home', !config.alwaysUseLatestTweets)

  updateCheckboxGroups()

  $form.addEventListener('change', (e) => {
    let $el = /** @type {HTMLInputElement} */ (e.target)
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
    document.body.classList.toggle('home', !config.alwaysUseLatestTweets)
    chrome.storage.local.set(config)
  })
})
