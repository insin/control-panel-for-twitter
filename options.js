document.title = chrome.i18n.getMessage(`extensionName`)

for (let optionValue of [
  '1000',
  '10000',
  '100000',
  '1000000',
]) {
  for (let $option of document.querySelectorAll(`option[value="${optionValue}"]`)) {
    $option.textContent = formatFollowerCount(Number(optionValue))
  }
}

for (let optionValue of [
  'badges',
  'comfortable',
  'compact',
  'default',
  'dim',
  'hide',
  'ignore',
  'lightsOut',
  'liked',
  'mostRecent',
  'popular',
  'recent',
  'relevant',
  'separate',
]) {
  let label = chrome.i18n.getMessage(`option_${optionValue}`)
  for (let $option of document.querySelectorAll(`option[value="${optionValue}"]`)) {
    $option.textContent = label
  }
}

for (let translationId of [
  'addAddMutedWordMenuItemLabel_desktop',
  'addAddMutedWordMenuItemLabel_mobile',
  'addUserHoverCardAccountLocationLabel',
  'addFocusedTweetAccountLocationLabel',
  'alwaysUseLatestTweetsLabel',
  'bypassAgeVerificationLabel',
  'customCssLabel',
  'darkModeThemeLabel',
  'debugInfo',
  'debugLabel',
  'debugLogTimelineStatsLabel',
  'debugOptionsLabel',
  'defaultToLatestSearchLabel',
  'disableHomeTimelineInfo',
  'disableHomeTimelineLabel',
  'disableTweetTextFormattingLabel',
  'disabledHomeTimelineRedirectLabel',
  'disabledHomeTimelineRedirectOption_messages',
  'dontUseChirpFontLabel',
  'dropdownMenuFontWeightLabel',
  'enabled',
  'experimentsOptionsLabel',
  'exportConfigLabel',
  'fastBlockLabel',
  'followButtonStyleLabel',
  'followButtonStyleOption_monochrome',
  'followButtonStyleOption_themed',
  'fullWidthContentInfo',
  'fullWidthContentLabel',
  'fullWidthMediaLabel',
  'hideAccountSwitcherLabel',
  'hideAdsNavLabel',
  'hideAllMetricsLabel',
  'hideBookmarkButtonLabel',
  'hideBookmarkMetricsLabel',
  'hideComposeTweetLabel',
  'hideDiscoverSuggestionsLabel',
  'hideEditImageLabel',
  'hideExploreNavLabel',
  'hideExploreNavWithSidebarLabel',
  'hideExplorePageContentsLabel',
  'hideFollowingMetricsLabel',
  'hideForYouTimelineLabel',
  'hideGrokLabel',
  'hideGrokTweetsLabel',
  'hideInlinePrompts',
  'hideJobsLabel',
  'hideLikeMetricsLabel',
  'hideLiveBroadcastBarLabel',
  'hideLiveBroadcastsLabel',
  'hideManageTimelinesLabel',
  'hideMessagesDrawerLabel',
  'hideMetricsLabel',
  'hideMoreFromThisAuthorLabel',
  'hideMoreSlideOutMenuItemsOptionsLabel_desktop',
  'hideMoreSlideOutMenuItemsOptionsLabel_mobile',
  'hideNotificationLikesLabel',
  'hideNotificationRetweetsLabel',
  'hideProfileHeaderMetricsLabel',
  'hideProfileRetweetsLabel',
  'hideQuoteTweetMetricsLabel',
  'hideReplyMetricsLabel',
  'hideRetweetMetricsLabel',
  'hideSeeNewTweetsLabel',
  'hideShareTweetButtonLabel',
  'hideSidebarContentLabel',
  'hideSpacesNavLabel',
  'hideSubscriptionsLabel',
  'hideSuggestedContentSearchLabel',
  'hideSuggestedFollowsLabel',
  'hideTimelineTweetBoxLabel',
  'hideTodaysNewsLabel',
  'hideToggleNavigationLabel',
  'hideTwitterBlueRepliesLabel',
  'hideTwitterBlueUpsellsLabel',
  'hideUnavailableQuoteTweetsLabel',
  'hideUnusedUiItemsOptionsLabel',
  'hideVerifiedNotificationsTabLabel',
  'hideViewActivityLinksLabel',
  'hideViewsLabel',
  'hideWhatsHappeningLabel',
  'hideWhoToFollowEtcLabel',
  'homeTimelineOptionsLabel',
  'listRetweetsLabel',
  'mutableQuoteTweetsLabel',
  'navBaseFontSizeLabel',
  'navDensityLabel',
  'preventNextVideoAutoplayInfo',
  'preventNextVideoAutoplayLabel',
  'quoteTweetsLabel',
  'reduceAlgorithmicContentOptionsLabel',
  'reduceEngagementOptionsLabel',
  'reducedInteractionModeInfo',
  'reducedInteractionModeLabel',
  'replaceLogoLabel',
  'restoreLinkHeadlinesLabel',
  'restoreOtherInteractionLinksLabel',
  'restoreQuoteTweetsLinkLabel',
  'restoreTweetSourceLabel',
  'retweetsLabel',
  'revertMediaCarouselLabel',
  'revertProfileTabsLabel',
  'revertTwemojiLabel',
  'showBlueReplyFollowersCountAmountLabel',
  'showBookmarkButtonUnderFocusedTweetsLabel',
  'showPremiumReplyBusinessLabel',
  'showPremiumReplyFollowedByLabel',
  'showPremiumReplyFollowingLabel',
  'showPremiumReplyGovernmentLabel',
  'showRelevantPeopleLabel',
  'sidebarLabel',
  'sortFollowingLabel',
  'sortRepliesLabel',
  'tweakNewLayoutInfo',
  'tweakNewLayoutLabel',
  'tweakQuoteTweetsPageLabel',
  'twitterBlueChecksLabel',
  'twitterBlueChecksOption_replace',
  'uiImprovementsOptionsLabel',
  'uiTweaksOptionsLabel',
  'unblurSensitiveContentLabel',
  'uninvertFollowButtonsLabel',
  'xFixesLabel',
]) {
  let $el = document.getElementById(translationId)
  if ($el) {
    $el.textContent = chrome.i18n.getMessage(translationId)
  } else {
    console.warn('could not find element for translationId', translationId)
  }
}

for (let translationClass of [
  'hideBusinessNavLabel',
  'hideChatNavLabel',
  'hideCommunitiesNavLabel',
  'hideConnectNavLabel',
  'hideCreatorStudioNavLabel',
  'hideHistoryNavLabel',
  'hideListsNavLabel',
  'notificationsLabel',
  'saveAndApplyButton',
]) {
  let translation = chrome.i18n.getMessage(translationClass)
  for (let $el of document.querySelectorAll(`.${translationClass}`)) {
    $el.textContent = translation
  }
}

for (let amount of [1_000, 10_000, 100_000, 1_000_000]) {
  document.querySelector(`option[value="${amount}"]`).textContent = formatFollowerCount(amount)
}

/** @type {boolean} */
let desktop
/** @type {boolean} */
let mobile

const $body = document.body

if (navigator.userAgent.includes('Safari/') && !/Chrom(e|ium)\//.test(navigator.userAgent)) {
  $body.classList.add('safari', /iP(ad|hone)/.test(navigator.userAgent) ? 'iOS' : 'macOS')
} else {
  $body.classList.toggle('edge', navigator.userAgent.includes('Edg/'))
}

//#region Default config
/** @type {import("./types").Config} */
const defaultConfig = {
  enabled: true,
  debug: false,
  debugLogTimelineStats: false,
  // Default based on the platform if the main script hasn't run on Twitter yet
  version: /(Android|iP(ad|hone))/.test(navigator.userAgent) ? 'mobile' : 'desktop',
  // Shared
  addAddMutedWordMenuItem: true,
  addFocusedTweetAccountLocation: false,
  alwaysUseLatestTweets: true,
  bypassAgeVerification: true,
  darkModeTheme: 'lightsOut',
  defaultToLatestSearch: false,
  disableHomeTimeline: false,
  disabledHomeTimelineRedirect: 'notifications',
  disableTweetTextFormatting: false,
  // Downloads
  downloadMedia: true,
  downloadFilenameFormat: '{yyyy}-{mm}-{dd}-{hh}-{MM}-{ss}-{ms}-{username}-{tweet_id}',
  downloadSubfolder: '',
  downloadVideoQuality: 'highest',
  dontUseChirpFont: false,
  dropdownMenuFontWeight: true,
  fastBlock: true,
  followButtonStyle: 'monochrome',
  hideAdsNav: true,
  hideBookmarkButton: false,
  hideBookmarkMetrics: true,
  hideBusinessNav: true,
  hideChatNav: false,
  hideCommunitiesNav: false,
  hideComposeTweet: false,
  hideConnectNav: true,
  hideCreatorStudioNav: true,
  hideEditImage: true,
  hideExplorePageContents: true,
  hideFollowingMetrics: true,
  hideForYouTimeline: true,
  hideGrokNav: true,
  hideGrokTweets: false,
  hideHistoryNav: false,
  hideInlinePrompts: true,
  hideJobsNav: true,
  hideLikeMetrics: true,
  hideListsNav: false,
  hideManageTimelines: false,
  hideMetrics: false,
  hideMoreFromThisAuthor: true,
  hideMoreTweets: true,
  hideNotificationLikes: false,
  hideNotificationRetweets: false,
  hideNotifications: 'ignore',
  hideProfileRetweets: false,
  hideQuoteTweetMetrics: true,
  hideQuotesFrom: [],
  hideReplyMetrics: true,
  hideRetweetMetrics: true,
  hideSeeNewTweets: false,
  hideShareTweetButton: false,
  hideSortRepliesMenu: false,
  hideSubscriptions: true,
  hideSuggestedContentSearch: true,
  hideTotalTweetsMetrics: true,
  hideTwitterBlueReplies: false,
  hideTwitterBlueUpsells: true,
  hideUnavailableQuoteTweets: true,
  hideVerifiedNotificationsTab: true,
  hideViewActivityLinks: true,
  hideViews: true,
  hideWhoToFollowEtc: true,
  listRetweets: 'ignore',
  mutableQuoteTweets: true,
  mutedQuotes: [],
  quoteTweets: 'ignore',
  reducedInteractionMode: false,
  replaceLogo: true,
  restoreLinkHeadlines: true,
  restoreOtherInteractionLinks: true,
  restoreQuoteTweetsLink: true,
  restoreTweetSource: true,
  retweets: 'separate',
  revertMediaCarousel: true,
  revertProfileTabs: false,
  revertTwemoji: true,
  showBlueReplyFollowersCount: false,
  showBlueReplyFollowersCountAmount: '1000000',
  showBookmarkButtonUnderFocusedTweets: true,
  showPremiumReplyBusiness: true,
  showPremiumReplyFollowedBy: true,
  showPremiumReplyFollowing: true,
  showPremiumReplyGovernment: true,
  sortFollowing: 'mostRecent',
  sortReplies: 'relevant',
  tweakNewLayout: false,
  tweakQuoteTweetsPage: true,
  twitterBlueChecks: 'replace',
  uninvertFollowButtons: true,
  unblurSensitiveContent: false,
  // Experiments
  customCss: '',
  // Desktop only
  addUserHoverCardAccountLocation: true,
  fullWidthContent: false,
  fullWidthMedia: true,
  hideAccountSwitcher: false,
  hideExploreNav: true,
  hideExploreNavWithSidebar: true,
  hideLiveBroadcasts: false,
  hideMessagesDrawer: true,
  hideSidebarContent: true,
  hideSpacesNav: false,
  hideSuggestedFollows: false,
  hideTimelineTweetBox: false,
  hideTodaysNews: false,
  hideToggleNavigation: false,
  hideWhatsHappening: false,
  navBaseFontSize: true,
  navDensity: 'default',
  showRelevantPeople: false,
  // Mobile only
  hideLiveBroadcastBar: false,
  hideMessagesBottomNavItem: false,
  preventNextVideoAutoplay: true,
}
//#endregion

//#region Config & variables
/**
 * Complete configuration for the options page.
 * @type {import("./types").Config}
 */
let optionsConfig

/**
 * Checkbox group configuration for the version being used (mobile or desktop).
 * @type {Map<string, string[]>}
 */
let checkboxGroups

// Page elements
let $experiments = /** @type {HTMLDetailsElement} */ (document.querySelector('details#experiments'))
let $exportConfig = document.querySelector('#export-config')
let $form = document.querySelector('form')
let $hideQuotesFrom =  /** @type {HTMLDivElement} */ (document.querySelector('#hideQuotesFrom'))
let $hideQuotesFromDetails = /** @type {HTMLDetailsElement} */ (document.querySelector('details#hideQuotesFromDetails'))
let $hideQuotesFromLabel = /** @type {HTMLElement} */ (document.querySelector('#hideQuotesFromLabel'))
let $mutedQuotes =  /** @type {HTMLDivElement} */ (document.querySelector('#mutedQuotes'))
let $mutedQuotesDetails =  /** @type {HTMLDetailsElement} */ (document.querySelector('details#mutedQuotesDetails'))
let $mutedQuotesLabel = /** @type {HTMLElement} */ (document.querySelector('#mutedQuotesLabel'))
let $saveCustomCssButton = document.querySelector('button#saveCustomCss')
let $showBlueReplyFollowersCountLabel = /** @type {HTMLElement} */ (document.querySelector('#showBlueReplyFollowersCountLabel'))
//#endregion

//#region Utility functions
function exportConfig() {
  let $a = document.createElement('a')
  $a.download = 'control-panel-for-twitter-v4.24.1.config.txt'
  $a.href = URL.createObjectURL(new Blob([
    JSON.stringify(optionsConfig, null, 2)
  ], {type: 'text/plain'}))
  $a.click()
  URL.revokeObjectURL($a.href)
}

function formatFollowerCount(num) {
  let numFormat = Intl.NumberFormat(undefined, {notation: 'compact', compactDisplay: num < 1_000_000 ? 'short' : 'long'})
  return numFormat.format(num)
}

/**
 * @param {keyof HTMLElementTagNameMap} tagName
 * @param {({[key: string]: any} | null)?} attributes
 * @param {...any} children
 * @returns {HTMLElement}
 */
 function h(tagName, attributes, ...children) {
  let $el = document.createElement(tagName)

  if (attributes) {
    for (let [prop, value] of Object.entries(attributes)) {
      if (prop.startsWith('on') && typeof value == 'function') {
        $el.addEventListener(prop.slice(2).toLowerCase(), value)
      } else {
        $el[prop] = value
      }
    }
  }

  for (let child of children) {
    if (child == null || child === false) continue
    if (child instanceof Node) {
      $el.appendChild(child)
    } else {
      $el.insertAdjacentText('beforeend', String(child))
    }
  }

  return $el
}
//#endregion

//#region Options page functions
/**
 * Update the options page to match the current config.
 */
function applyConfig() {
  mobile = optionsConfig.version == 'mobile'
  desktop = !mobile
  $body.classList.toggle('mobile', mobile)
  $body.classList.toggle('desktop', desktop)
  checkboxGroups = new Map(Object.entries({
    hideAllMetrics: [
      'hideBookmarkMetrics',
      'hideFollowingMetrics',
      'hideLikeMetrics',
      'hideReplyMetrics',
      'hideRetweetMetrics',
      'hideQuoteTweetMetrics',
      'hideTotalTweetsMetrics',
    ]
  }))
  updateFormControls()
  updateCheckboxGroups()
  updateDisplay()
}

/**
 * @param {Event} e
 */
function onFormChanged(e) {
  if (e.target instanceof HTMLTextAreaElement) return

  /** @type {Partial<import("./types").Config>} */
  let changedConfig = {}

  let $el = /** @type {HTMLInputElement} */ (e.target)
  if ($el.type == 'checkbox') {
    if (checkboxGroups.has($el.name)) {
      checkboxGroups.get($el.name).forEach(checkboxName => {
        optionsConfig[checkboxName] = changedConfig[checkboxName] = $el.checked
        updateFormControl($form.elements[checkboxName], $el.checked)
      })
      $el.indeterminate = false
    } else {
      optionsConfig[$el.name] = changedConfig[$el.name] = $el.checked
      // Don't try to redirect the Home timeline to Notifications if both are disabled
      if ($el.name == 'hideNotifications' &&
          $el.checked &&
          optionsConfig.disabledHomeTimelineRedirect == 'notifications') {
        $form.elements['disabledHomeTimelineRedirect'].value = 'messages'
        optionsConfig.disabledHomeTimelineRedirect = 'messages'
        changedConfig.disabledHomeTimelineRedirect = 'messages'
      }
      updateCheckboxGroups()
    }
  } else {
    optionsConfig[$el.name] = changedConfig[$el.name] = $el.value
  }

  updateDisplay()

  storeConfigChanges(changedConfig)
}

/**
 * @param {{[key: string]: chrome.storage.StorageChange}} changes
 */
function onStorageChanged(changes) {
  let configChanges = Object.fromEntries(
    Object.entries(changes).map(([key, {newValue}]) => [key, newValue])
  )
  Object.assign(optionsConfig, configChanges)
  applyConfig()
}

function saveCustomCss() {
  if (optionsConfig.customCss == $form.elements['customCss'].value) return

  /** @type {Partial<import("./types").Config>} */
  let changedConfig = {}
  optionsConfig['customCss'] = changedConfig['customCss'] = $form.elements['customCss'].value
  storeConfigChanges(changedConfig)
}

function shouldDisplayHideQuotesFrom() {
  return optionsConfig.mutableQuoteTweets && optionsConfig.hideQuotesFrom.length > 0
}

function shouldDisplayMutedQuotes() {
  return optionsConfig.mutableQuoteTweets && optionsConfig.mutedQuotes.length > 0
}

/**
 * @param {Partial<import("./types").Config>} changes
 */
function storeConfigChanges(changes) {
  chrome.storage.onChanged.removeListener(onStorageChanged)
  chrome.storage.local.set(changes, () => {
    chrome.storage.onChanged.addListener(onStorageChanged)
  })
}

function updateCheckboxGroups() {
  for (let [group, checkboxNames] of checkboxGroups.entries()) {
    let checkedCount = checkboxNames.filter(name => optionsConfig[name]).length
    $form.elements[group].checked = checkedCount == checkboxNames.length
    $form.elements[group].indeterminate = checkedCount > 0 && checkedCount < checkboxNames.length;
  }
}

function updateDisplay() {
  $body.classList.toggle('debugging', optionsConfig.debug)
  $body.classList.toggle('chronological', optionsConfig.alwaysUseLatestTweets)
  $body.classList.toggle('disabled', !optionsConfig.enabled)
  $body.classList.toggle('disabledHomeTimeline', optionsConfig.disableHomeTimeline)
  $body.classList.toggle('fullWidthContent', optionsConfig.fullWidthContent)
  $body.classList.toggle('hidingBookmarkButton', optionsConfig.hideBookmarkButton)
  $body.classList.toggle('hidingExploreNav', optionsConfig.hideExploreNav)
  $body.classList.toggle('hidingMetrics', optionsConfig.hideMetrics)
  $body.classList.toggle('hidingNotifications', optionsConfig.hideNotifications == 'hide')
  $body.classList.toggle('hidingQuotesFrom', shouldDisplayHideQuotesFrom())
  $body.classList.toggle('hidingSuggestedFollows', optionsConfig.hideSidebarContent || optionsConfig.hideSuggestedFollows)
  $body.classList.toggle('hidingTwitterBlueReplies', optionsConfig.hideTwitterBlueReplies)
  $body.classList.toggle('mutingQuotes', shouldDisplayMutedQuotes())
  $body.classList.toggle('showingBlueReplyFollowersCount', optionsConfig.showBlueReplyFollowersCount)
  $body.classList.toggle('showingSidebarContent', !optionsConfig.hideSidebarContent)
  $body.classList.toggle('tweakingNewLayout', optionsConfig.tweakNewLayout)
  $body.classList.toggle('uninvertedFollowButtons', optionsConfig.uninvertFollowButtons)
  $showBlueReplyFollowersCountLabel.textContent = chrome.i18n.getMessage(
    'showBlueReplyFollowersCountLabel',
    formatFollowerCount(Number(optionsConfig.showBlueReplyFollowersCountAmount))
  )
  updateHideQuotesFromDisplay()
  updateMutedQuotesDisplay()
}


function updateHideQuotesFromDisplay() {
  if (!shouldDisplayHideQuotesFrom()) return

  $hideQuotesFromLabel.textContent = chrome.i18n.getMessage('hideQuotesFromLabel', String(optionsConfig.hideQuotesFrom.length))

  if (!$hideQuotesFromDetails.open) return

  while ($hideQuotesFrom.hasChildNodes()) $hideQuotesFrom.firstChild.remove()
  for (let user of optionsConfig.hideQuotesFrom) {
    $hideQuotesFrom.appendChild(
      h('section', null,
        h('label', {className: 'button'},
          h('span', null, `@${user}`),
          h('button', {
            type: 'button',
            onclick() {
              optionsConfig.hideQuotesFrom = optionsConfig.hideQuotesFrom.filter(u => u != user)
              storeConfigChanges({hideQuotesFrom: optionsConfig.hideQuotesFrom})
              updateDisplay()
            }
          }, chrome.i18n.getMessage('unmuteButtonText'))
        )
      )
    )
  }
}

function updateMutedQuotesDisplay() {
  if (!shouldDisplayMutedQuotes()) return

  $mutedQuotesLabel.textContent = chrome.i18n.getMessage('mutedTweetsLabel', String(optionsConfig.mutedQuotes.length))

  if (!$mutedQuotesDetails.open) return

  while ($mutedQuotes.hasChildNodes()) $mutedQuotes.firstChild.remove()

  optionsConfig.mutedQuotes.forEach(({user, time, text}, index) => {
    $mutedQuotes.appendChild(
      h('section', null,
        h('label', {className: 'button mutedQuote'},
          h('div', null,
            user,
            ' – ',
            new Intl.DateTimeFormat([], {dateStyle: 'medium'}).format(new Date(time)),
            text && h('p', {className: 'mb-0'}, text),
          ),
          h('button', {
            type: 'button',
            onclick: () => {
              optionsConfig.mutedQuotes = optionsConfig.mutedQuotes.filter((_, i) => i != index)
              chrome.storage.local.set({mutedQuotes: optionsConfig.mutedQuotes})
              updateDisplay()
            },
          }, chrome.i18n.getMessage('unmuteButtonText'))
        )
      )
    )
  })
}

function updateFormControls() {
  Object.keys(optionsConfig)
        .filter(prop => prop in $form.elements)
        .forEach(prop => updateFormControl($form.elements[prop], optionsConfig[prop]))
}

function updateFormControl($control, value) {
  if ($control instanceof RadioNodeList) {
    // If a checkbox displays in multiple sections, update them all
    $control.forEach(input => /** @type {HTMLInputElement} */ (input).checked = value)
  }
  else if ($control.type == 'checkbox') {
    $control.checked = value
  }
  else {
    $control.value = value
  }
}
//#endregion

/**
 * Resolves legacy format presets into standard template strings.
 * @param {string} format
 * @returns {string}
 */
function normalizeFilenameTemplate(format) {
  if (typeof format !== 'string' || !format.trim()) {
    return '{yyyy}-{mm}-{dd}-{hh}-{MM}-{ss}-{ms}-{username}-{tweet_id}'
  }
  let trimmed = format.trim()
  if (trimmed === 'username_id') return '{username}_{tweet_id}'
  if (trimmed === 'id') return '{tweet_id}'
  if (trimmed === 'username_type_id') return '{username}_{type}_{tweet_id}'
  return trimmed
}

/**
 * Expands tokens within a template based on metadata.
 * @param {string} template
 * @param {object} metadata
 * @returns {string}
 */
function expandTokens(template, metadata = {}) {
  let d = metadata.timestamp instanceof Date ? metadata.timestamp : (metadata.timestamp ? new Date(metadata.timestamp) : new Date())
  if (isNaN(d.getTime())) d = new Date()

  const tokenMap = {
    '{yyyy}': String(d.getFullYear()),
    '{yy}': String(d.getFullYear()).slice(-2),
    '{mm}': String(d.getMonth() + 1).padStart(2, '0'),
    '{m}': String(d.getMonth() + 1),
    '{dd}': String(d.getDate()).padStart(2, '0'),
    '{d}': String(d.getDate()),
    '{hh}': String(d.getHours()).padStart(2, '0'),
    '{h}': String(d.getHours()),
    '{MM}': String(d.getMinutes()).padStart(2, '0'),
    '{ss}': String(d.getSeconds()).padStart(2, '0'),
    '{ms}': String(d.getMilliseconds()).padStart(3, '0'),
    '{author}': metadata.author != null ? String(metadata.author) : '',
    '{username}': metadata.username != null ? String(metadata.username) : '',
    '{title}': metadata.title != null ? String(metadata.title) : '',
    '{tweet_id}': metadata.tweetId != null ? String(metadata.tweetId) : '',
    '{type}': metadata.type != null ? String(metadata.type) : 'media',
  }

  return template.replace(/\{(yyyy|yy|mm|m|dd|d|hh|h|MM|ss|ms|author|username|title|tweet_id|type)\}/g, (match) => {
    return tokenMap[match] !== undefined ? tokenMap[match] : match
  })
}

/**
 * Sanitizes a filename base string to be filesystem and path safe.
 * @param {string} str
 * @returns {string}
 */
function sanitizeFilenameBase(str) {
  if (typeof str !== 'string') return ''
  let sanitized = str
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/[\x00-\x1f\x7f-\x9f]/g, '')
    .replace(/[/\\:*?"<>|]/g, '_')
    .replace(/\s+/g, ' ')
    .replace(/_+/g, '_')
    .replace(/^[\s._]+|[\s._]+$/g, '')
    .trim()

  const MAX_FILENAME_BASE_LENGTH = 180
  if (sanitized.length > MAX_FILENAME_BASE_LENGTH) {
    sanitized = sanitized.slice(0, MAX_FILENAME_BASE_LENGTH).replace(/^[\s._]+|[\s._]+$/g, '').trim()
  }

  return sanitized
}

/**
 * Generates the final media filename given metadata, index, total, extension, and template.
 */
function generateMediaFilename(metadataOrUser, tweetIdOrIndex, indexOrTotal, totalOrExt, extOrType, mediaTypeOrFormat, formatOrTemplate) {
  let metadata = {}
  let index = 0
  let total = 1
  let ext = 'mp4'
  let rawTemplate = '{yyyy}-{mm}-{dd}-{hh}-{MM}-{ss}-{ms}-{username}-{tweet_id}'

  if (typeof metadataOrUser === 'object' && metadataOrUser !== null) {
    metadata = metadataOrUser
    index = Number(tweetIdOrIndex) || 0
    total = Number(indexOrTotal) || 1
    ext = totalOrExt || 'mp4'
    rawTemplate = extOrType || '{yyyy}-{mm}-{dd}-{hh}-{MM}-{ss}-{ms}-{username}-{tweet_id}'
  } else {
    let username = metadataOrUser || 'user'
    let tweetId = tweetIdOrIndex || ''
    index = Number(indexOrTotal) || 0
    total = Number(totalOrExt) || 1
    ext = extOrType || 'mp4'
    let mediaType = mediaTypeOrFormat || 'media'
    rawTemplate = formatOrTemplate || '{yyyy}-{mm}-{dd}-{hh}-{MM}-{ss}-{ms}-{username}-{tweet_id}'

    metadata = {
      author: username,
      username,
      tweetId,
      type: mediaType,
      title: '',
      timestamp: new Date(),
    }
  }

  let template = normalizeFilenameTemplate(rawTemplate)
  let expanded = expandTokens(template, metadata)
  let sanitized = sanitizeFilenameBase(expanded)

  if (!sanitized) {
    let fallbackUser = sanitizeFilenameBase(metadata.username || metadata.author || 'twitter_user') || 'twitter_user'
    let fallbackId = metadata.tweetId || `${Date.now()}`
    sanitized = `${fallbackUser}_${fallbackId}`
  }

  let indexStr = total > 1 ? `_${String(index + 1).padStart(2, '0')}` : ''
  let cleanExt = String(ext || 'mp4').replace(/^\.+/, '').toLowerCase()

  let hasExt = new RegExp(`\\.${cleanExt}$`, 'i').test(sanitized)
  let baseWithoutExt = hasExt ? sanitized.slice(0, -(cleanExt.length + 1)) : sanitized

  return `${baseWithoutExt}${indexStr}.${cleanExt}`
}

const SAMPLE_METADATA = {
  author: 'Elon Musk',
  username: '@elonmusk',
  title: 'Starship flight test',
  tweetId: '183204928139785682',
  type: 'video',
  timestamp: new Date('2026-09-06T22:31:45.037'),
}

function updateFilenamePreview() {
  let $input = /** @type {HTMLInputElement} */ ($form.elements['downloadFilenameFormat'])
  let $preview = document.getElementById('filenamePreview')
  if (!$input || !$preview) return
  let template = $input.value || '{yyyy}-{mm}-{dd}-{hh}-{MM}-{ss}-{ms}-{username}-{tweet_id}'
  $preview.textContent = generateMediaFilename(SAMPLE_METADATA, 0, 1, 'mp4', template)
}

function setupFilenameFormatControls() {
  let $input = /** @type {HTMLInputElement} */ ($form.elements['downloadFilenameFormat'])
  if (!$input) return

  $input.addEventListener('input', () => {
    updateFilenamePreview()
  })

  let $tokenHelper = document.querySelector('.token-helper')
  if ($tokenHelper) {
    $tokenHelper.addEventListener('click', (e) => {
      let $btn = /** @type {HTMLElement} */ (e.target)?.closest('.token-btn')
      if (!$btn) return
      let token = $btn.getAttribute('data-token')
      if (!token) return

      let start = $input.selectionStart ?? $input.value.length
      let end = $input.selectionEnd ?? $input.value.length
      let val = $input.value
      $input.value = val.slice(0, start) + token + val.slice(end)
      let newCursor = start + token.length
      $input.setSelectionRange(newCursor, newCursor)
      $input.focus()

      updateFilenamePreview()
      $input.dispatchEvent(new Event('change', { bubbles: true }))
    })
  }

  let $resetBtn = document.getElementById('resetFilenameFormatBtn')
  if ($resetBtn) {
    $resetBtn.addEventListener('click', () => {
      $input.value = '{yyyy}-{mm}-{dd}-{hh}-{MM}-{ss}-{ms}-{username}-{tweet_id}'
      $input.focus()
      updateFilenamePreview()
      $input.dispatchEvent(new Event('change', { bubbles: true }))
    })
  }
}
//#endregion

//#region Main
function main() {
  chrome.storage.local.get((/** @type {Partial<import("./types").Config>} */ storedConfig) => {
    // Update deprecated config values
    // @ts-ignore
    if (storedConfig.twitterBlueChecks == 'dim') {
      storedConfig.twitterBlueChecks = 'replace'
    }
    if (storedConfig.downloadFilenameFormat) {
      storedConfig.downloadFilenameFormat = normalizeFilenameTemplate(storedConfig.downloadFilenameFormat)
    }
    optionsConfig = {...defaultConfig, ...storedConfig}

    $body.classList.toggle('debug', optionsConfig.debug === true)
    $experiments.open = Boolean(optionsConfig.customCss)
    $exportConfig.addEventListener('click', exportConfig)
    $form.addEventListener('change', onFormChanged)
    $hideQuotesFromDetails.addEventListener('toggle', updateHideQuotesFromDisplay)
    $mutedQuotesDetails.addEventListener('toggle', updateMutedQuotesDisplay)
    $saveCustomCssButton.addEventListener('click', saveCustomCss)
    chrome.storage.onChanged.addListener(onStorageChanged)

    setupFilenameFormatControls()

    if (!optionsConfig.debug) {
      let $version = document.querySelector('#version')
      let $debugCountdown = document.querySelector('#debugCountdown')
      let debugCountdown = 5

      function onClick(e) {
        if (e.target === $version || $version.contains(/** @type {Node} */ (e.target))) {
          debugCountdown--
        } else {
          debugCountdown = 5
        }

        if (debugCountdown == 0) {
          $body.classList.add('debug')
          $debugCountdown.textContent = ''
          $form.removeEventListener('click', onClick)
        }
        else if (debugCountdown <= 3) {
          $debugCountdown.textContent = ` (${debugCountdown})`
        }
      }

      $form.addEventListener('click', onClick)
    }

    applyConfig()
  })
}

main()
//#endregion