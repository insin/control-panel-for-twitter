// ==UserScript==
// @name        Tweak New Twitter
// @description Always use Latest Tweets, manage retweets, and other UI tweaks for New Twitter
// @namespace   https://github.com/insin/tweak-new-twitter/
// @match       https://twitter.com/*
// @version     5
// ==/UserScript==

const HOME = 'Home'
const LATEST_TWEETS = 'Latest Tweets'
const RETWEETS = 'Retweets'

let Selectors = {
  PRIMARY_COLUMN: 'div[data-testid="primaryColumn"]',
  PRIMARY_NAV: 'nav[aria-label="Primary"]',
  SIDEBAR_COLUMN: 'div[data-testid="sidebarColumn"]',
  TIMELINE: 'div[aria-label^="Timeline"]',
  TWEET: 'div[data-testid="tweet"]',
}

Object.assign(Selectors, {
  SIDEBAR_FOOTER: `${Selectors.SIDEBAR_COLUMN} nav`,
  SIDEBAR_PEOPLE: `${Selectors.SIDEBAR_COLUMN} aside`,
  SIDEBAR_TRENDS: `${Selectors.SIDEBAR_COLUMN} section`,
})

/** Title of the current page, without the ' / Twitter' suffix */
let currentPage = ''

/** MutationObservers active on the current page */
let pageObservers = []

/**
  * Default config enables all features.
  *
  * You'll need to edit the config object manually for now if you're using this
  * as a user script.
  */
let config = {
  alwaysUseLatestTweets: true,
  hideBookmarksNav: true,
  hideExploreNav: true,
  hideListsNav: true,
  hideSidebarContent: true,
  navBaseFontSize: true,
  retweets: 'separate',
}

config.enableDebugLogging = false

function addStyle(css) {
  let $style = document.createElement('style')
  $style.dataset.insertedBy = 'tweak-new-twitter'
  $style.textContent = css
  document.head.appendChild($style)
  return $style
}

function log(...args) {
  if (config.enableDebugLogging) {
    console.log(`TWT${currentPage ? `(${currentPage})` : ''}`, ...args)
  }
}

function s(n) {
  return n == 1 ? '' : 's'
}

function applyCss() {
  var cssRules = []
  var hideCssSelectors = []
  if (config.hideSidebarContent) {
    hideCssSelectors.push(
      Selectors.SIDEBAR_TRENDS,
      Selectors.SIDEBAR_PEOPLE,
      Selectors.SIDEBAR_FOOTER
    )
  }
  if (config.hideExploreNav) {
    hideCssSelectors.push(`${Selectors.PRIMARY_NAV} a[href="/explore"]`)
  }
  if (config.hideExploreNav) {
    hideCssSelectors.push(`${Selectors.PRIMARY_NAV} a[href="/i/bookmarks"]`)
  }
  if (config.hideListsNav) {
    hideCssSelectors.push(`${Selectors.PRIMARY_NAV} a[href*="/lists"]`)
  }
  if (hideCssSelectors.length > 0) {
    cssRules.push(`${hideCssSelectors.join(', ')} { display: none !important; }`)
  }
  if (cssRules.length > 0) {
    addStyle(cssRules.join('\n'))
  }
}

function observeTitle() {
  let $title = document.querySelector('title')

  if ($title == null) {
    log('waiting for title')
    return setTimeout(observeTitle, 1000 / 60 * 3)
  }

  function processPage(title) {
    // Ignore Flash of Uninitialised Title navigating to a screen for the first time
    if (title == 'Twitter') {
      return
    }

    // Assumption: all non-FOUT title changes are navigation / redraws

    if (pageObservers.length > 0) {
      log(`disconnecting ${pageObservers.length} page observer${s(pageObservers.length)}`)
      pageObservers.forEach(observer => observer.disconnect())
      pageObservers = []
    }

    currentPage = title.split(' / ')[0]

    log('navigation occurred')

    if (currentPage == HOME && config.alwaysUseLatestTweets) {
      switchToLatestTweets(currentPage)
    }
    if (currentPage == HOME || currentPage == LATEST_TWEETS || currentPage == RETWEETS) {
      if (config.retweets != 'ignore') {
        observeTimeline(currentPage)
      }
    }
    if (config.hideSidebarContent) {
       hideSidebarContents(currentPage)
       observeSidebar(currentPage)
    }
  }

  processPage($title.textContent)

  // Watch for page navigation
  log('observing <title> text')
  new MutationObserver((mutations) => {
    processPage($title.textContent)
  }).observe($title, {
    characterData: true,
    childList: true,
  })
}

function switchToLatestTweets(page, attempts = 1) {
  let $switchButton = document.querySelector('div[aria-label="Top Tweets on"]')

  if ($switchButton == null) {
    if (currentPage != page) {
      return log(`stopped waiting for ${page} switch button`)
    }
    if (attempts == 10) {
      return log(`stopped waiting for switch button after ${attempts} attempts`)
    }
    return setTimeout(switchToLatestTweets, 1000 / 60 * 20, page, attempts + 1)
  }

  setTimeout(() => {
    log('opening "See latest Tweets instead" menu')
    $switchButton.click()
    clickLatestTweetsMenuItem(page)
  }, 100)
}

function clickLatestTweetsMenuItem(page, attempts = 1) {
  let $seeLatestTweetsInstead = document.querySelector('div[role="menuitem"]')

  if ($seeLatestTweetsInstead == null) {
    if (currentPage != page) {
      return log(`stopped waiting for ${page} "See latest Tweets instead" menu item`)
    }
    if (attempts == 20) {
      return log(`stopped waiting for "See latest Tweets instead" menu item after ${attempts} attempts`)
    }
    return setTimeout(clickLatestTweetsMenuItem, 1000 / 60 * 5, page, attempts + 1)
  }

  log('switching to Latest Tweets')
  $seeLatestTweetsInstead.closest('div[tabindex="0"]').click()
}

/**
 * This script assumes navigation has occurred when the document title changes,
 * so we effectively create a fake navigation to a "Retweets" page by changing
 * the title to "Retweets".
 */
function addRetweetsHeader(page) {
  let $timelineTitle = document.querySelector('main h2')
  if ($timelineTitle != null &&
      document.querySelector('#twt_retweets') == null) {
    log('inserting Retweets header')
    let div = document.createElement('div')
    div.innerHTML = $timelineTitle.parentNode.outerHTML
    $retweets = div.firstElementChild
    $retweets.id = 'twt_retweets'
    $retweets.querySelector('span').textContent = RETWEETS
    $retweets.addEventListener('click', () => {
      if (!document.title.startsWith(RETWEETS)) {
        document.title = `${RETWEETS} / Twitter`
      }
      window.scrollTo({top: 0})
    })
    $timelineTitle.parentNode.parentNode.insertAdjacentElement('afterend', $retweets)
    $timelineTitle.parentNode.addEventListener('click', () => {
      if (!document.title.startsWith(page)) {
        document.title = `${page} / Twitter`
      }
    })
  }
}

function observeTimeline(page) {
  var $timeline = document.querySelector(Selectors.TIMELINE)
  var $firstTweet = document.querySelector(Selectors.TWEET)

  // Add the new "Retweets" header ASAP
  if (config.retweets == 'separate') {
    addRetweetsHeader(page)
  }

  if ($timeline == null ||
      $timeline.firstElementChild == null ||
      $timeline.firstElementChild.firstElementChild == null ||
      $firstTweet == null) {
    if (currentPage != page) {
      return log(`stopped waiting for ${page} timeline`)
    }
    return setTimeout(observeTimeline, 1000 / 60 * 5, page)
  }

  function processTimeline($timelineContainer) {
    log(`processing ${$timelineContainer.children.length} timeline node${s($timelineContainer.children.length)}`)
    let previousNodeType = null
    for (let $node of $timelineContainer.children) {
      let hideNode = null
      let $tweet = $node.querySelector(Selectors.TWEET)
      if ($tweet) {
        let isRetweet = $tweet.previousElementSibling != null &&
                        $tweet.previousElementSibling.textContent.includes('Retweeted')
        hideNode = page == RETWEETS ? !isRetweet : isRetweet
        previousNodeType = isRetweet ? 'RETWEET' : 'TWEET'
      }
      else {
        // "Show this thread" links sometimes appear in the subsequent timeline node as an <a>
        // Sometimes the subsequent node is just an empty <div>
        if (previousNodeType != null) {
          hideNode = page == RETWEETS ? previousNodeType != 'RETWEET' : previousNodeType != 'TWEET'
        }
        else {
          log('unhandled timeline node', $node)
        }
        previousNodeType = null
      }

      if (hideNode != null) {
        $node.firstElementChild.style.display = hideNode ? 'none' : ''
      }
    }
  }

  // Watch for new tweets being rendered
  log('observing timeline childList')
  let $timelineContainer = $timeline.firstElementChild.firstElementChild
  processTimeline($timelineContainer)
  let observer = new MutationObserver(() => processTimeline($timelineContainer))
  observer.observe($timelineContainer, {
    childList: true
  })
  pageObservers.push(observer)
}

function observeSidebar(page) {
  let $primaryColumn = document.querySelector(Selectors.PRIMARY_COLUMN)

  if ($primaryColumn == null) {
    if (currentPage != page) {
      return log(`stopped waiting for ${page} primary column`)
    }
    return setTimeout(observeSidebar, 1000 / 60 * 3, page)
  }

  // Watch for sidebar appearing when the responsive breakpoint is hit
  log('observing sidebar')
  let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((el) => {
        if (el.dataset.testid == 'sidebarColumn') {
          log('sidebar appeared')
          hideSidebarContents(page)
        }
      })
    })
  })
  observer.observe($primaryColumn.parentNode, {
    childList: true
  })
  pageObservers.push(observer)
}

function hideSidebarContents(page, attempts = 1) {
  let $trends = document.querySelector(Selectors.SIDEBAR_TRENDS)
  if ($trends) {
    let $trendsModule = $trends.parentNode.parentNode.parentNode
    $trendsModule.style.display = 'none'
    // Hide surrounding elements which draw separators between modules
    if ($trendsModule.previousElementSibling &&
        $trendsModule.previousElementSibling.childElementCount == 0) {
      $trendsModule.previousElementSibling.style.display = 'none'
    }
    if ($trendsModule.nextElementSibling &&
        $trendsModule.nextElementSibling.childElementCount == 0) {
      $trendsModule.nextElementSibling.style.display = 'none'
    }
  }

  let $people = document.querySelector(Selectors.SIDEBAR_PEOPLE)
  if ($people) {
     let $peopleModule
     if ($people.getAttribute('aria-label') == 'Relevant people') {
       // "Relevant people" section when viewing a Tweet/thread
       $peopleModule = $people.parentNode
     } else {
       // "Who to follow" section
       $peopleModule = $people.parentNode.parentNode
     }
     $peopleModule.style.display = 'none'
  }

  if ($trends == null || $people == null) {
    if (currentPage != page) {
      return log(`stopped waiting for ${page} sidebar`)
    }
    if (attempts == 10) {
      return log(`stopped waiting for sidebar content after ${attempts} attempts`)
    }
    return setTimeout(hideSidebarContents, 333, page, attempts + 1)
  }

  log('hid all sidebar content')
}

function observeHtmlFontSize() {
  let $html = document.querySelector('html')
  let $style = addStyle('')
  let lastFontSize = ''

  function setCss(fontSize) {
    log(`setting nav font size to ${fontSize}`)
    lastFontSize = fontSize
    $style.textContent = [
      `${Selectors.PRIMARY_NAV} div[dir="auto"] span { font-size: ${fontSize}; font-weight: normal; }`,
      `${Selectors.PRIMARY_NAV} div[dir="auto"] { margin-top: -4px; }`
    ].join('\n')
  }

  log('observing <html> style attribute')
  if ($html.style.fontSize) {
    setCss($html.style.fontSize)
  }
  new MutationObserver(() => {
    if ($html.style.fontSize != lastFontSize) {
      setCss($html.style.fontSize)
    }
  }).observe($html, {
    attributes: true,
    attributeFilter: ['style']
  })
}

function main() {
  log('config', config)
  applyCss()
  if (config.navBaseFontSize) {
    observeHtmlFontSize()
  }
  if (config.retweets != 'ignore' || config.hideSidebarContents) {
    observeTitle()
  }
}

chrome.storage.local.get((storedConfig) => {
  Object.assign(config, storedConfig)
  main()
})
