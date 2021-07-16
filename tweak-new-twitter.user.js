// ==UserScript==
// @name        Tweak New Twitter
// @description Stay on the Latest Tweets timeline, reduce "engagement" and tone down some of Twitter's UI
// @namespace   https://github.com/insin/tweak-new-twitter/
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @version     27
// ==/UserScript==

//#region Custom types
/** @typedef {'TWEET'|'QUOTE_TWEET'|'RETWEET'|'PROMOTED_TWEET'|'HEADING'} TimelineItemType */

/** @typedef {'separate'|'hide'|'ignore'} SharedTweetsConfig */

/** @typedef {'highlight'|'hide'|'ignore'} VerifiedAccountsConfig */
//#endregion

//#region Config & variables
/**
 * Default config enables all features.
 *
 * You'll need to edit the config object manually for now if you're using this
 * as a user script.
 */
const config = {
  alwaysUseLatestTweets: true,
  fastBlock: true,
  hideAccountSwitcher: true,
  hideBookmarksNav: true,
  hideExploreNav: true,
  hideListsNav: true,
  hideMessagesDrawer: true,
  hideMoreTweets: true,
  hideOriginalTweetWhenViewingQuoteTweets: true,
  hideSidebarContent: true,
  hideWhoToFollowEtc: true,
  navBaseFontSize: true,
  /** @type {SharedTweetsConfig} */
  quoteTweets: 'ignore',
  /** @type {SharedTweetsConfig} */
  retweets: 'separate',
  /** @type {VerifiedAccountsConfig} */
  verifiedAccounts: 'ignore',
}

config.enableDebugLogging = false

// Document title names used by Twitter
const HOME = 'Home'
const LATEST_TWEETS = 'Latest Tweets'
const MESSAGES = 'Messages'
const QUOTE_TWEETS = 'Quote Tweets'

const PROFILE_TITLE_RE = /\(@[a-z\d_]{1,15}\)$/i
const TITLE_NOTIFICATION_RE = /^\(\d+\+?\) /
const URL_TWEET_ID_RE = /\/status\/(\d+)$/
const URL_PHOTO_RE = /photo\/\d$/

const Selectors = {
  MESSAGES_DRAWER: 'div[data-testid="DMDrawer"]',
  NAV_HOME_LINK: 'a[data-testid="AppTabBar_Home_Link"]',
  PRIMARY_COLUMN: 'div[data-testid="primaryColumn"]',
  PRIMARY_NAV: 'nav[aria-label="Primary"]',
  PROMOTED_TWEET: '[data-testid="placementTracking"]',
  SIDEBAR_COLUMN: 'div[data-testid="sidebarColumn"]',
  TIMELINE_HEADING: 'h2[role="heading"]',
  TWEET: 'div[data-testid="tweet"]',
  VERIFIED_TICK: 'svg[aria-label="Verified account"]',
}

Object.assign(Selectors, {
  TIMELINE: `${Selectors.PRIMARY_COLUMN} section > h1 + div[aria-label] > div`,
})

/** Title of the current page, without the ' / Twitter' suffix */
let currentPage = ''

/** Notification count in the title (including trailing space), e.g. '(1) ' */
let currentNotificationCount = ''

/** Current URL path */
let currentPath = ''

/** Flag for a Home / Latest Tweets link having been clicked */
let homeLinkClicked = false

/**
 * MutationObservers active on the current page
 * @type MutationObserver[]
 */
let pageObservers = []

// Config for the fake timeline used to display retweets/quote tweets separately
let separatedTweetsTimelineTitle = ''
let separatedTweetsTimelineName = ''

function configureSeparatedTweetsTimeline() {
  if (config.retweets == 'separate' && config.quoteTweets == 'separate') {
    separatedTweetsTimelineTitle = separatedTweetsTimelineName = 'Shared Tweets'
  } else if (config.retweets == 'separate') {
    separatedTweetsTimelineTitle = separatedTweetsTimelineName = 'Retweets'
  } else if (config.quoteTweets == 'separate') {
    // Twitter already uses 'Quote Tweets' as a page title
    // ☠ ¡This string starts with a ZWSP! ☠
    separatedTweetsTimelineTitle = separatedTweetsTimelineName = '​Quote Tweets'
  }
}
//#endregion

//#region Utility functions
/**
 * @param {string} css
 * @return {HTMLStyleElement}
 */
function addStyle(css) {
  let $style = document.createElement('style')
  $style.dataset.insertedBy = 'tweak-new-twitter'
  $style.textContent = css
  document.head.appendChild($style)
  return $style
}

/**
 * @param {string} selector
 * @param {{
 *   name?: string
 *   stopIf?: () => boolean
 *   context?: Document | HTMLElement
 *   timeout?: number
 * }} options
 * @returns {Promise<HTMLElement>}
 */
function getElement(selector, {
  name = null,
  stopIf = null,
  context = document,
  timeout = Infinity,
} = {}) {
  return new Promise((resolve) => {
    let startTime = Date.now()
    let rafId
    let timeoutId

    function stop($element, reason) {
      if ($element == null) {
        log(`stopped waiting for ${name || selector} after ${reason}`)
      }
      else if (Date.now() > startTime) {
        log(`${name || selector} appeared after ${Date.now() - startTime}ms`)
      }
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      resolve($element)
    }

    if (timeout !== Infinity) {
      timeoutId = setTimeout(stop, timeout, null, `${timeout}ms timeout`)
    }

    function queryElement() {
      let $element = context.querySelector(selector)
      if ($element) {
        stop($element)
      }
      else if (stopIf?.() === true) {
        stop(null, 'stopIf condition met')
      }
      else {
        rafId = requestAnimationFrame(queryElement)
      }
    }

    queryElement()
  })
}

function log(...args) {
  if (config.enableDebugLogging) {
    console.log(`TNT${currentPage ? `(${currentPage})` : ''}`, ...args)
  }
}

/**
 * Convenience wrapper for the MutationObserver API.
 *
 * The callback is called immediately to support using an observer and its
 * options as a trigger for any change, without looking at MutationRecords.
 *
 * @param {Node} $element
 * @param {MutationCallback} callback
 * @param {MutationObserverInit} options
 */
function observeElement($element, callback, options = {childList: true}) {
  let observer = new MutationObserver(callback)
  callback([], observer)
  observer.observe($element, options)
  return observer
}

/**
 * @param {string} page
 * @returns {() => boolean}
 */
function pageIsNot(page) {
  return () => page != currentPage
}

/**
 * @param {string} path
 * @returns {() => boolean}
 */
function pathIsNot(path) {
  return () => path != currentPath
}

/**
 * @param {number} n
 * @returns {string}
 */
function s(n) {
  return n == 1 ? '' : 's'
}
//#endregion

//#region Global observers
function observeHtmlFontSize() {
  let $html = document.querySelector('html')
  let $style = addStyle('')
  let lastFontSize = ''

  log('observing html style attribute for font-size changes')
  let observer = observeElement($html, () => {
    if ($html.style.fontSize != lastFontSize) {
      lastFontSize = $html.style.fontSize
      log(`setting nav font size to ${lastFontSize}`)
      $style.textContent = [
        `${Selectors.PRIMARY_NAV} div[dir="auto"] span { font-size: ${lastFontSize}; font-weight: normal; }`,
        `${Selectors.PRIMARY_NAV} div[dir="auto"] { margin-top: -4px; }`
      ].join('\n')
    }
  }, {
    attributes: true,
    attributeFilter: ['style']
  })

  return {
    disconnect() {
      $style.remove()
      observer.disconnect()
    }
  }
}

async function observeTitle() {
  let $title = await getElement('title', {name: '<title>'})
  log('observing <title>')
  return observeElement($title, () => onTitleChange($title.textContent), {
    childList: true,
  })
}

async function observePopups() {
  let $keyboardWrapper = await getElement('[data-at-shortcutkeys]', {
    name: 'keyboard wrapper',
  })
  log('observing popups')
  observeElement($keyboardWrapper.previousElementSibling, (mutations) => {
    mutations.forEach((mutation) => {
      // The first popup takes another tick to render content
      mutation.addedNodes.forEach($el => requestAnimationFrame(() => onPopup($el)))
    })
  })
}
//#endregion

//#region Page observers for the current page
async function observeSidebar(page) {
  let $primaryColumn = await getElement(Selectors.PRIMARY_COLUMN, {
    name: 'primary column',
    stopIf: pageIsNot(page),
  })

  /**
   * Hides <aside> or <section> elements as they appear in the sidebar.
   * @param {MutationRecord[]} mutations
   */
  function sidebarMutationCallback(mutations)  {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach(($el) => {
        if ($el.nodeType == Node.ELEMENT_NODE &&
            ($el.nodeName == 'ASIDE' || $el.nodeName == 'SECTION')) {
          hideSidebarElement(/** @type {HTMLElement} */ ($el))
        }
      })
    })
  }

  let $sidebarColumn = document.querySelector(Selectors.SIDEBAR_COLUMN)
  if ($sidebarColumn) {
    log('observing sidebar')
    hideSidebarContents()
    pageObservers.push(
      observeElement($sidebarColumn, sidebarMutationCallback, {childList: true, subtree: true})
    )
  }
  else {
    log('waiting for sidebar to appear')
  }

  pageObservers.push(
    observeElement($primaryColumn.parentNode, (mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach(($el) => {
          if (/** @type {HTMLElement} */ ($el).dataset.testid == 'sidebarColumn') {
            log('sidebar appeared')
            hideSidebarContents()
            observeElement($el, sidebarMutationCallback, {childList: true, subtree: true})
          }
        })
      })
    })
  )
}

async function observeTimeline(page) {
  let $timeline = await getElement(Selectors.TIMELINE, {
    name: 'timeline',
    stopIf: pageIsNot(page),
  })
  if ($timeline == null) {
    return
  }

  // On 2020-04-03 Twitter switched to a new way of rendering the timeline which replaces an initial
  // container with the real element which holds timeline tweets and reduces the number of elements
  // wrapping the timeline.
  //
  // v1.9 was released to handle this.
  //
  // On 2020-04-05 they switched back to the old method.
  //
  // This attempts to support both approaches in case they keeping switching between the two.

  // The "new" inital timeline element is a placeholder which doesn't have a style attribute
  // The "old" timeline has 2 wrapper divs which apply padding via the DOM .style object
  if ($timeline.hasAttribute('style')) {
    // The "old" timeline is nested one level deeper and the initial container has padding-bottom
    // <div aria-label="Timeline: Your Home Timeline">
    //   <div style="padding-bottom: 0px"> <!-- current $timeline -->
    //     <div style="padding-top: ...px; padding-bottom: ...px"> <!-- we want to observe this -->
    //       <div> <!-- tweet elements are at this level -->
    //       ...
    if ($timeline.style.paddingBottom) {
      $timeline = /** @type {HTMLElement} */ ($timeline.firstElementChild)
      log('observing "old" timeline', {$timeline})
    }
    else {
      log('observing "new" timeline', {$timeline})
    }
    pageObservers.push(
      observeElement($timeline, () => onTimelineChange($timeline, page))
    )
  }
  else {
    log('waiting for real "new" timeline')
    let startTime = Date.now()
    pageObservers.push(
      observeElement($timeline.parentNode, (mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach(($timeline) => {
            if (Date.now() > startTime) {
              log(`"new" timeline appeared after ${Date.now() - startTime}ms`)
            }
            log('observing "new" timeline', {$timeline})
            pageObservers.push(
              observeElement($timeline, () => onTimelineChange($timeline, page))
            )
          })
        })
      })
    )
  }
}
//#endregion

//#region Tweak functions
async function addRetweetsHeader(page) {
  let $timelineTitle = await getElement('main h2', {
    name: 'timeline title',
    stopIf: pageIsNot(page),
  })
  if ($timelineTitle != null &&
      document.querySelector('#tnt_separated_tweets') == null) {
    log('inserting separates tweets timeline header')
    let div = document.createElement('div')
    div.innerHTML = $timelineTitle.parentElement.outerHTML
    let $retweets = div.firstElementChild
    $retweets.querySelector('h2').id = 'tnt_separated_tweets'
    $retweets.querySelector('span').textContent = separatedTweetsTimelineName
    // This script assumes navigation has occurred when the document title changes,
    // so by changing the title to "Retweets" we effectively fake navigation to a
    // non-existent Retweets page.
    $retweets.addEventListener('click', () => {
      if (!document.title.startsWith(separatedTweetsTimelineTitle)) {
        setTitle(separatedTweetsTimelineTitle)
      }
      window.scrollTo({top: 0})
    })
    $timelineTitle.parentElement.parentElement.insertAdjacentElement('afterend', $retweets)
    // Go back to the main timeline from Retweets when the Latest Tweets / Home heading is clicked
    $timelineTitle.parentElement.addEventListener('click', () => {
      if (!document.title.startsWith(page)) {
        homeLinkClicked = true
        setTitle(page)
      }
    })
    // Go back to the main timeline from Retweets when the Home nav link is clicked
    document.querySelector(Selectors.NAV_HOME_LINK).addEventListener('click', () => {
      homeLinkClicked = true
      if (location.pathname == '/home' && !document.title.startsWith(page)) {
        setTitle(page)
      }
    })
  }
}

function addStaticCss() {
  var cssRules = []
  var hideCssSelectors = []
  if (config.hideSidebarContent) {
    hideCssSelectors.push(
      // Sidefooter
      `${Selectors.SIDEBAR_COLUMN} nav`,
      // Who to Follow
      `${Selectors.SIDEBAR_COLUMN} aside`,
      // What's Happening, Topics to Follow etc.
      `${Selectors.SIDEBAR_COLUMN} section`
    )
  }
  if (config.hideExploreNav) {
    hideCssSelectors.push(`${Selectors.PRIMARY_NAV} a[href="/explore"]`)
  }
  if (config.hideBookmarksNav) {
    hideCssSelectors.push(`${Selectors.PRIMARY_NAV} a[href="/i/bookmarks"]`)
  }
  if (config.hideListsNav) {
    hideCssSelectors.push(`${Selectors.PRIMARY_NAV} a[href*="/lists"]`)
  }
  if (config.hideAccountSwitcher) {
    cssRules.push(`
header[role="banner"] > div > div > div > div:last-child {
  flex-shrink: 1 !important;
  align-items: end !important;
}
[data-testid="SideNav_AccountSwitcher_Button"] > div:first-child,
[data-testid="SideNav_AccountSwitcher_Button"] > div:first-child + div {
  display: none !important;
}
    `)
  }
  if (config.hideMessagesDrawer) {
    hideCssSelectors.push(Selectors.MESSAGES_DRAWER)
  }
  if (hideCssSelectors.length > 0) {
    cssRules.push(`${hideCssSelectors.join(', ')} { display: none !important; }`)
  }
  if (cssRules.length > 0) {
    addStyle(cssRules.join('\n'))
  }
}

/**
 * Attempts to determine the type of a timeline Tweet given the element with data-testid="tweet" on
 * it, falling back to TWEET if it doesn't appear to be one of the particular types we care about.
 * @param {HTMLElement} $tweet
 * @returns {TimelineItemType}
 */
function getTweetType($tweet) {
  if ($tweet.closest(Selectors.PROMOTED_TWEET)) {
    return 'PROMOTED_TWEET'
  }
  if ($tweet.previousElementSibling?.textContent.includes('Retweeted')) {
    return 'RETWEET'
  }
  if ($tweet.querySelector('div[id^="id__"] > div[dir="auto"] > span')?.textContent.includes('Quote Tweet') ||
      // QTs of accounts you blocked are displayed as a nested <article> with "This Tweet is unavailable."
      $tweet.querySelector('article')) {
    return 'QUOTE_TWEET'
  }
  return 'TWEET'
}

/**
 * Hides all <aside> or <section> elements which are already in the sidebar.
 */
function hideSidebarContents() {
  Array.from(
    document.querySelectorAll(`${Selectors.SIDEBAR_COLUMN} aside, ${Selectors.SIDEBAR_COLUMN} section`),
    hideSidebarElement
  )
}

/**
 * Finds the topmost container for a sidebar content element and hides it.
 * @param {HTMLElement} $element
 */
function hideSidebarElement($element) {
  let $sidebarContainer = $element.parentElement
  while (!$sidebarContainer.previousElementSibling) {
     $sidebarContainer = $sidebarContainer.parentElement
  }
  $sidebarContainer.style.display = 'none'
}

function onPopup($topLevelElement) {
  let $confirmButton = $topLevelElement.querySelector('div[data-testid="confirmationSheetConfirm"]')
  // Block button
  if ($confirmButton && $confirmButton.innerText == 'Block') {
    if (config.fastBlock) {
      log('Fast blocking')
      $confirmButton.click()
    }
    return
  }
}

function onTimelineChange($timeline, page) {
  log(`processing ${$timeline.children.length} timeline item${s($timeline.children.length)}`)
  /** @type {HTMLElement} */
  let $previousItem = null
  /** @type {?TimelineItemType} */
  let previousItemType = null
  /** @type {?boolean} */
  let hidPreviousItem = null
  for (let $item of $timeline.children) {
    /** @type {?TimelineItemType} */
    let itemType = null
    /** @type {?boolean} */
    let hideItem = null
    /** @type {?HTMLElement} */
    let $tweet = $item.querySelector(Selectors.TWEET)

    if ($tweet != null) {
      itemType = getTweetType($tweet)
      if (page == LATEST_TWEETS || page == separatedTweetsTimelineTitle || page == HOME) {
        if (isReplyToPreviousTweet($tweet)) {
          hideItem = hidPreviousItem
          itemType = previousItemType
        } else {
          hideItem = shouldHideTimelineItem(itemType, page)
        }
      }
    }

    if (itemType == null && config.hideWhoToFollowEtc) {
      // "Who to follow", "Follow some Topics" etc. headings
      if ($item.querySelector(Selectors.TIMELINE_HEADING)) {
        itemType = 'HEADING'
        hideItem = true
        // Also hide the divider above the heading
        if ($previousItem?.innerText == '' && $previousItem.firstElementChild) {
          /** @type {HTMLElement} */ ($previousItem.firstElementChild).style.display = 'none'
        }
      }
    }

    if (itemType == null) {
      // Assume a non-identified item following an identified item is related to it
      // "Who to follow" users and "Follow some Topics" topics appear in subsequent items
      // "Show this thread" and "Show more" links appear in subsequent items
      if (previousItemType != null) {
        hideItem = hidPreviousItem
        itemType = previousItemType
      }
      // The first item in the timeline is sometimes an empty placeholder <div>
      else if ($item !== $timeline.firstElementChild) {
        // We're probably also missing some spacer / divider nodes
        log('unhandled timeline item', $item)
      }
    }

    if (hideItem !== true &&
        config.verifiedAccounts === 'hide' &&
        $item.querySelector(Selectors.VERIFIED_TICK)) {
      hideItem = true
    }

    if (hideItem != null) {
      if (/** @type {HTMLElement} */ ($item.firstElementChild).style.display !== (hideItem ? 'none' : '')) {
        /** @type {HTMLElement} */ ($item.firstElementChild).style.display = hideItem ? 'none' : ''
        // Log these out as they can't be reliably triggered for testing
        if (itemType == 'HEADING' || previousItemType == 'HEADING') {
          log(`hid a ${previousItemType == 'HEADING' ? 'post-' : ''}heading item`, $item)
        }
      }
    }

    if (hideItem !== true &&
        config.verifiedAccounts === 'highlight' &&
        $item.querySelector(Selectors.VERIFIED_TICK) &&
        $item.style.backgroundColor !== 'rgba(29, 161, 242, 0.25)') {
      $item.style.backgroundColor = 'rgba(29, 161, 242, 0.25)'
    }

    $previousItem = $item
    hidPreviousItem = hideItem
    // If we hid a heading, keep hiding everything after it until we hit a tweet
    if (!(previousItemType == 'HEADING' && itemType == null)) {
      previousItemType = itemType
    }
  }
}

function onTitleChange(title) {
  // Ignore any leading notification counts in titles, e.g. '(1) Latest Tweets / Twitter'
  let notificationCount = ''
  if (TITLE_NOTIFICATION_RE.test(title)) {
    notificationCount = TITLE_NOTIFICATION_RE.exec(title)[0]
    title = title.replace(TITLE_NOTIFICATION_RE, '')
  }

  let homeLinkWasClicked = homeLinkClicked
  homeLinkClicked = false

  // Ignore Flash of Uninitialised Title when navigating to a screen for the
  // first time.
  if (title == 'Twitter') {
    log('ignoring Flash of Uninitialised Title')
    return
  }

  // Only allow the same page to re-process if the "Customize your view" dialog
  // is currently open.
  let newPage = title.split(' / ')[0]
  if (newPage == currentPage && location.pathname != '/i/display') {
    log('ignoring duplicate title change')
    currentNotificationCount = notificationCount
    return
  }

  // Stay on the Retweets timeline when…
  if (currentPage == separatedTweetsTimelineTitle &&
      // …the title has changed back to the main timeline…
      (newPage == LATEST_TWEETS || newPage == HOME) &&
      // …the Home nav or Latest Tweets / Home header _wasn't_ clicked and…
      !homeLinkWasClicked &&
      (
        // …the user viewed a photo.
        URL_PHOTO_RE.test(location.pathname) ||
        // …the user stopped viewing a photo.
        URL_PHOTO_RE.test(currentPath) ||
        // …the user opened or used the "Customize your view" dialog.
        location.pathname == '/i/display' ||
        // …the user closed the "Customize your view" dialog.
        currentPath == '/i/display' ||
        // …the user opened the "Send via Direct Message" dialog.
        location.pathname == '/messages/compose' ||
        // …the user closed the "Send via Direct Message" dialog.
        currentPath == '/messages/compose' ||
        // …the user opened the compose Tweet dialog.
        location.pathname == '/compose/tweet' ||
        // …the user closed the compose Tweet dialog.
        currentPath == '/compose/tweet' ||
        // …the notification count in the title changed.
        notificationCount != currentNotificationCount
      )) {
    log('ignoring title change on Retweets timeline')
    currentNotificationCount = notificationCount
    currentPath = location.pathname
    setTitle(separatedTweetsTimelineTitle)
    return
  }

  // Assumption: all non-FOUT, non-duplicate title changes are navigation, which
  // need the screen to be re-processed.

  if (pageObservers.length > 0) {
    log(`disconnecting ${pageObservers.length} page observer${s(pageObservers.length)}`)
    pageObservers.forEach(observer => observer.disconnect())
    pageObservers = []
  }

  currentPage = newPage
  currentNotificationCount = notificationCount
  currentPath = location.pathname

  log('processing new page')

  if (config.alwaysUseLatestTweets && currentPage == HOME) {
    switchToLatestTweets(currentPage)
    return
  }

  let isOnHomeTimeline = (
    currentPage == LATEST_TWEETS || currentPage == separatedTweetsTimelineTitle || currentPage == HOME
  )

  if (config.retweets == 'separate' || config.quoteTweets == 'separate') {
    document.body.classList.toggle('Home', currentPage == HOME)
    document.body.classList.toggle('LatestTweets', currentPage == LATEST_TWEETS)
    document.body.classList.toggle('SeparatedTweets', currentPage == separatedTweetsTimelineTitle)
    updateThemeColor()
    if (isOnHomeTimeline) {
      addRetweetsHeader(currentPage)
    }
  }

  let shouldObserveHomeTimeline = isOnHomeTimeline && (
    config.retweets != 'ignore' || config.quoteTweets != 'ignore' || config.verifiedAccounts != 'ignore' || config.hideWhoToFollowEtc
  )
  let shouldObserveProfileTimeline = PROFILE_TITLE_RE.test(currentPage) && (
    config.verifiedAccounts != 'ignore' || config.hideWhoToFollowEtc
  )

  if (shouldObserveHomeTimeline || shouldObserveProfileTimeline) {
    observeTimeline(currentPage)
  }

  if (config.hideSidebarContent && currentPage != MESSAGES) {
    observeSidebar(currentPage)
  }

  if (config.hideMoreTweets && URL_TWEET_ID_RE.test(currentPath)) {
    let searchParams = new URLSearchParams(location.search)
    if (searchParams.has('ref_src') || searchParams.has('s')) {
      hideMoreTweetsSection(currentPath)
    }
  }

  if (config.hideOriginalTweetWhenViewingQuoteTweets && currentPage == QUOTE_TWEETS) {
    let $quoteTweetStyle = addStyle('[data-testid="tweet"] [aria-labelledby] > div:last-child { display: none; }')
    pageObservers.push(/** @type {MutationObserver} */ ({disconnect: () => $quoteTweetStyle.remove()}))
  }
}

/**
 * Automatically click the "Show this thread" link to get rid of the "More Tweets" section if the
 * user is viewing a tweet from an external link with a ?ref_src= URL.
 */
async function hideMoreTweetsSection(path) {
  let id = URL_TWEET_ID_RE.exec(path)[1]
  let $link = await getElement(`a[href$="/status/${id}"]`, {
    name: '"Show this thread" link',
    stopIf: pathIsNot(path),
  })
  if ($link != null) {
    log('clicking "Show this thread" link')
    $link.click()
  }
}

/**
 * Checks if a tweet is preceded by an element creating a vertical reply line.
 * @param {HTMLElement} $tweet
 * @returns {boolean}
 */
function isReplyToPreviousTweet($tweet) {
  let $replyLine = $tweet.previousElementSibling?.firstElementChild?.firstElementChild?.firstElementChild
  if ($replyLine) {
    return getComputedStyle($replyLine).width == '2px'
  }
}

/**
 * Sets the page name in <title>, retaining any current notification count.
 * @param {string} page
 */
function setTitle(page) {
  document.title = `${currentNotificationCount}${page} / Twitter`
}

/**
 * @param {TimelineItemType} type
 * @param {string} page
 * @returns {boolean}
 */
function shouldHideTimelineItem(type, page) {
  switch (type) {
    case 'RETWEET': return shouldHideSharedTweet(config.retweets, page)
    case 'QUOTE_TWEET': return shouldHideSharedTweet(config.quoteTweets, page)
    case 'TWEET': return page == separatedTweetsTimelineTitle
    default: return true
  }
}

/**
 * @param {SharedTweetsConfig} config
 * @param {string} page
 * @returns {boolean}
 */
function shouldHideSharedTweet(config, page) {
  switch (config) {
    case 'hide': return true
    case 'ignore': return page == separatedTweetsTimelineTitle
    case 'separate': return page != separatedTweetsTimelineTitle
  }
}

async function switchToLatestTweets(page) {
  let $switchButton = await getElement('div[aria-label="Top Tweets on"]', {
    name: 'timeline switch button',
    stopIf: pageIsNot(page),
  })

  if ($switchButton == null) {
    return false
  }

  $switchButton.click()

  let $seeLatestTweetsInstead = await getElement('div[role="menu"] div[role="menuitem"]', {
    name: '"See latest Tweets instead" menu item',
    stopIf: pageIsNot(page),
  })

  if ($seeLatestTweetsInstead == null) {
    return false
  }

  /** @type {HTMLElement} */ ($seeLatestTweetsInstead.closest('div[tabindex="0"]')).click()
  return true
}

let updateThemeColor = (function() {
  let $style = addStyle('')
  let lastThemeColor = null

  return async function updateThemeColor() {
    // Only try to update if the "Customize your view" dialog is open or we
    // haven't set an inital color yet.
    if (location.pathname !== '/i/display' && lastThemeColor != null) {
      return
    }

    let $tweetButton = await getElement('a[data-testid="SideNav_NewTweet_Button"]', {
      name: 'Tweet button'
    })

    let themeColor = getComputedStyle($tweetButton).backgroundColor
    if (themeColor === lastThemeColor) {
      return
    }
    log(`setting theme color to ${themeColor}`)
    lastThemeColor = themeColor
    $style.textContent = [
                           'body.Home main h2:not(#tnt_separated_tweets)',
                           'body.LatestTweets main h2:not(#tnt_separated_tweets)',
                           'body.SeparatedTweets #tnt_separated_tweets',
                         ].join(', ') + ` { color: ${lastThemeColor}; }`
  }
})()
//#endregion

//#region Main
function main() {
  log('config', config)

  addStaticCss()

  if (config.fastBlock) {
    observePopups()
  }

  if (config.navBaseFontSize) {
    observeHtmlFontSize()
  }

  if (config.hideMoreTweets ||
      config.hideSidebarContent ||
      config.hideWhoToFollowEtc ||
      config.retweets != 'ignore' ||
      config.quoteTweets != 'ignore' ||
      config.verifiedAccounts != 'ignore') {
    configureSeparatedTweetsTimeline()
    observeTitle()
  }
}

if (typeof chrome != 'undefined' && typeof chrome.storage != 'undefined') {
  chrome.storage.local.get((storedConfig) => {
    Object.assign(config, storedConfig)
    main()
  })
}
else {
  main()
}
//#endregion
