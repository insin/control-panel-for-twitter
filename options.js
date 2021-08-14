const mobile = navigator.userAgent.includes('Android')
const desktop = !mobile
const $body = document.body

$body.classList.add(mobile ? 'mobile' : 'desktop')
$body.classList.toggle('edge', navigator.userAgent.includes('Edg/'))
$body.querySelectorAll(mobile ? '.desktop' : '.mobile').forEach($el => $el.remove())

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
    'uninvertFollowButtons',
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
  hideAllMetrics: [
    'hideFollowingMetrics',
    'hideLikeMetrics',
    'hideReplyMetrics',
    'hideRetweetMetrics',
    'hideQuoteTweetMetrics',
    'hideTotalTweetsMetrics',
  ]
}))

/** @type {import("./types").Config} */
const defaultConfig = {
  // Shared
  addAddMutedWordMenuItem: true,
  alwaysUseLatestTweets: true,
  dontUseChirpFont: false,
  fastBlock: true,
  followButtonStyle: 'monochrome',
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
  hideUnavailableQuoteTweets: true,
  hideWhoToFollowEtc: true,
  likedTweets: 'hide',
  quoteTweets: 'ignore',
  repliedToTweets: 'hide',
  retweets: 'separate',
  suggestedTopicTweets: 'hide',
  tweakQuoteTweetsPage: true,
  uninvertFollowButtons: true,
  // Experiments
  disableHomeTimeline: false,
  disabledHomeTimelineRedirect: 'notifications',
  fullWidthContent: false,
  fullWidthMedia: false,
  hideMetrics: false,
  hideFollowingMetrics: true,
  hideLikeMetrics: true,
  hideQuoteTweetMetrics: true,
  hideReplyMetrics: true,
  hideRetweetMetrics: true,
  hideTotalTweetsMetrics: true,
  reducedInteractionMode: false,
  verifiedAccounts: 'ignore',
  // Desktop only
  hideAccountSwitcher: true,
  hideExploreNav: true,
  hideMessagesDrawer: true,
  hideSidebarContent: true,
  navBaseFontSize: true,
  showRelevantPeople: false,
  // Mobile only
  hideAppNags: true,
  hideExplorePageContents: true,
  hideMessagesBottomNavItem: false,
}

/**
 * Complete configuration for the options page.
 * @type {import("./types").Config}
 */
let optionsConfig

chrome.storage.local.get((storedConfig) => {
  optionsConfig = {...defaultConfig, ...storedConfig}

  let $form = document.querySelector('form')
  let $experiments = /** @type {HTMLDetailsElement} */ (document.querySelector('details#experiments'))
  $experiments.open = (
    optionsConfig.disableHomeTimeline ||
    optionsConfig.fullWidthContent ||
    optionsConfig.hideMetrics ||
    optionsConfig.reducedInteractionMode ||
    optionsConfig.verifiedAccounts != 'ignore'
  )

  function updateCheckboxGroups() {
    for (let [group, checkboxNames] of checkboxGroups.entries()) {
      let checkedCount = checkboxNames.filter(name => optionsConfig[name]).length
      $form.elements[group].checked = checkedCount == checkboxNames.length
      $form.elements[group].indeterminate = checkedCount > 0 && checkedCount < checkboxNames.length;
    }
  }

  function updateBodyClassNames() {
    $body.classList.toggle('disabledHomeTimeline', optionsConfig.disableHomeTimeline)
    $body.classList.toggle('fullWidthContent', optionsConfig.fullWidthContent)
    $body.classList.toggle('hidingMetrics', optionsConfig.hideMetrics)
    $body.classList.toggle('hidingSidebarContent', optionsConfig.hideSidebarContent)
    $body.classList.toggle('home', !optionsConfig.alwaysUseLatestTweets)
    $body.classList.toggle('uninvertedFollowButtons', optionsConfig.uninvertFollowButtons)
  }

  for (let prop in optionsConfig) {
    if (prop in $form.elements) {
      if ($form.elements[prop].type == 'checkbox') {
        $form.elements[prop].checked = optionsConfig[prop]
      }
      else {
        $form.elements[prop].value = optionsConfig[prop]
      }
    }
  }

  updateBodyClassNames()
  updateCheckboxGroups()

  $form.addEventListener('change', (e) => {
    /** @type {Partial<import("./types").Config>} */
    let changedConfig = {}

    let $el = /** @type {HTMLInputElement} */ (e.target)
    if ($el.type == 'checkbox') {
      if (checkboxGroups.has($el.name)) {
        checkboxGroups.get($el.name).forEach(checkboxName => {
          optionsConfig[checkboxName] = changedConfig[checkboxName] = $form.elements[checkboxName].checked = $el.checked
        })
        $el.indeterminate = false
      } else {
        optionsConfig[$el.name] = changedConfig[$el.name] = $el.checked
        updateCheckboxGroups()
      }
    }
    else {
      optionsConfig[$el.name] = changedConfig[$el.name] = $el.value
    }

    updateBodyClassNames()

    chrome.storage.local.set(changedConfig)
  })
})


