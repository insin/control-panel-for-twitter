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
    'hideCommunitiesNav',
    'hideShareTweetButton',
    'hideTweetAnalyticsLinks',
    desktop && 'hideAccountSwitcher',
    desktop && 'hideBookmarksNav',
    desktop && 'hideExploreNav',
    desktop && 'hideMessagesDrawer',
    mobile && 'hideMessagesBottomNavItem',
  ].filter(Boolean),
  hideMoreSlideOutMenuItems: [
    'hideAnalyticsNav',
    'hideHelpCenterNav',
    'hideListsNav',
    'hideMomentsNav',
    'hideNewslettersNav',
    'hideTopicsNav',
    'hideTwitterAdsNav',
    'hideTwitterBlueNav',
    'hideTwitterForProfessionalsNav',
    desktop && 'hideKeyboardShortcutsNav',
    mobile && 'hideBookmarksNav',
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
  debug: false,
  // Shared
  addAddMutedWordMenuItem: true,
  alwaysUseLatestTweets: true,
  dontUseChirpFont: false,
  fastBlock: true,
  followButtonStyle: 'monochrome',
  followeesFollows: 'hide',
  hideAnalyticsNav: true,
  hideBookmarksNav: true,
  hideCommunitiesNav: true,
  hideHelpCenterNav: true,
  hideKeyboardShortcutsNav: false,
  hideListsNav: true,
  hideMomentsNav: true,
  hideMoreTweets: true,
  hideNewslettersNav: true,
  hideShareTweetButton: false,
  hideTopicsNav: true,
  hideTweetAnalyticsLinks: false,
  hideTwitterAdsNav: true,
  hideTwitterBlueNav: true,
  hideTwitterForProfessionalsNav: true,
  hideUnavailableQuoteTweets: true,
  hideWhoToFollowEtc: true,
  likedTweets: 'hide',
  listTweets: 'hide',
  mutableQuoteTweets: true,
  mutedQuotes: [],
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

let $experiments = /** @type {HTMLDetailsElement} */ (document.querySelector('details#experiments'))
let $exportConfig = document.querySelector('#export-config')
let $form = document.querySelector('form')
let $mutedQuotes =  /** @type {HTMLDivElement} */ (document.querySelector('#mutedQuotes'))
let $mutedQuotesDetails =  /** @type {HTMLDetailsElement} */ (document.querySelector('details#mutedQuotesDetails'))
let $mutedQuotesLabel = /** @type {HTMLElement} */ (document.querySelector('#mutedQuotesLabel'))

function applyConfig() {
  updateFormControls()
  updateCheckboxGroups()
  updateDisplay()
}

function exportConfig() {
  let $a = document.createElement('a')
  $a.download = 'tweak-new-twitter.config.txt'
  $a.href = URL.createObjectURL(new Blob([
    JSON.stringify({version: '2.15.0', ...sortProperties(optionsConfig)}, null, 2)
  ], {type: 'text/plain'}))
  $a.click()
  URL.revokeObjectURL($a.href)
}

/**
 * @param {keyof HTMLElementTagNameMap} tagName
 * @param {{[key: string]: any}} [attributes]
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

/**
 * @param {Event} e
 */
function onFormChanged(e) {
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

/**
 * @param {number} n
 * @returns {string}
 */
 function s(n) {
  return n == 1 ? '' : 's'
}

function shouldDisplayMutedQuotes() {
  return optionsConfig.mutableQuoteTweets && optionsConfig.mutedQuotes.length > 0
}

function sortProperties(obj) {
  let entries = Object.entries(obj)
  entries.sort(([a], [b]) => {
    if (a < b) return -1
    if (a > b) return 1
    return 0
  })
  return Object.fromEntries(entries)
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
  $body.classList.toggle('disabledHomeTimeline', optionsConfig.disableHomeTimeline)
  $body.classList.toggle('fullWidthContent', optionsConfig.fullWidthContent)
  $body.classList.toggle('hidingMetrics', optionsConfig.hideMetrics)
  $body.classList.toggle('hidingSidebarContent', optionsConfig.hideSidebarContent)
  $body.classList.toggle('home', !optionsConfig.alwaysUseLatestTweets)
  $body.classList.toggle('mutedQuotes', shouldDisplayMutedQuotes())
  $body.classList.toggle('uninvertedFollowButtons', optionsConfig.uninvertFollowButtons)
  updateMutedQuotesDisplay()
}

function updateMutedQuotesDisplay() {
  if (!shouldDisplayMutedQuotes()) return

  $mutedQuotesLabel.textContent = `Muted tweets (${optionsConfig.mutedQuotes.length})`

  if (!$mutedQuotesDetails.open) return

  while ($mutedQuotes.hasChildNodes()) $mutedQuotes.firstChild.remove()

  optionsConfig.mutedQuotes.forEach(({user, time, text}, index) => {
    $mutedQuotes.appendChild(
      h('section', {className: 'button'},
        h('span', null,
          user,
          ' – ',
          new Intl.DateTimeFormat([], {dateStyle: 'medium'}).format(new Date(time)),
          h('br'),
          text,
        ),
        h('input', {
          type: 'button',
          value: 'Unmute',
          onclick: () => {
            optionsConfig.mutedQuotes = optionsConfig.mutedQuotes.filter((_, i) => i != index)
            chrome.storage.local.set({mutedQuotes: optionsConfig.mutedQuotes})
            updateDisplay()
          },
        })
      )
    )
  })
}

function updateFormControls() {
  for (let prop in optionsConfig) {
    if (prop in $form.elements) {
      if ($form.elements[prop].type == 'checkbox') {
        $form.elements[prop].checked = optionsConfig[prop]
      } else {
        $form.elements[prop].value = optionsConfig[prop]
      }
    }
  }
}

chrome.storage.local.get((storedConfig) => {
  optionsConfig = {...defaultConfig, ...storedConfig}

  $body.classList.toggle('debug', optionsConfig.debug === true)
  $experiments.open = (
    optionsConfig.disableHomeTimeline ||
    optionsConfig.fullWidthContent ||
    optionsConfig.hideMetrics ||
    optionsConfig.reducedInteractionMode ||
    optionsConfig.verifiedAccounts != 'ignore'
  )
  $exportConfig.addEventListener('click', exportConfig)
  $form.addEventListener('change', onFormChanged)
  $mutedQuotesDetails.addEventListener('toggle', updateMutedQuotesDisplay)
  chrome.storage.onChanged.addListener(onStorageChanged)

  if (!optionsConfig.debug) {
    let $showDebugOptions = document.querySelector('#showDebugOptions')
    let $debugCountdown = document.querySelector('#debugCountdown')
    let debugCountdown = 5

    function onClick(e) {
      if (e.target === $showDebugOptions || $showDebugOptions.contains(/** @type {Node} */ (e.target))) {
        debugCountdown--
      } else {
        debugCountdown = 5
      }

      if (debugCountdown == 0) {
        $body.classList.add('debug')
        $debugCountdown.textContent = ''
        $form.removeEventListener('click', onClick)
        $showDebugOptions.classList.remove('clickable')
      } else if (debugCountdown <= 3) {
        $debugCountdown.textContent = ` (Debug options: ${debugCountdown} more click${s(debugCountdown)} to enable)`
      }
    }

    $form.addEventListener('click', onClick)
    $showDebugOptions.classList.add('clickable')
  }

  applyConfig()
})
