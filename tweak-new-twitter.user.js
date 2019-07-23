// ==UserScript==
// @name        Tweak New Twitter
// @description Hide retweets, and other UI tweaks for New Twitter
// @namespace   https://github.com/insin/tweak-new-twitter/
// @match       https://twitter.com/*
// @version     2
// ==/UserScript==

const HOME = 'Home'
const LATEST_TWEETS = 'Latest Tweets'

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
  hideRetweets: true,
  hideSidebarContent: true,
  navBaseFontSize: true,
  hideExploreNav: true,
  hideBookmarksNav: true,
  hideListsNav: true,
  enableDebugLogging: false,
}

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
      // Trends
      'div[data-testid="sidebarColumn"] section',
      // Who to follow
      'div[data-testid="sidebarColumn"] aside',
      // Footery stuff in the side bar because infinite scroll
      'div[data-testid="sidebarColumn"] nav'
    )
  }
  if (config.hideExploreNav) {
    hideCssSelectors.push('nav a[href="/explore"]')
  }
  if (config.hideExploreNav) {
    hideCssSelectors.push('nav a[href="/i/bookmarks"]')
  }
  if (config.hideListsNav) {
    hideCssSelectors.push('nav a[href*="/lists"]')
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

    // Assumption: all non-FOUT page title changes are navigation / redraws

    if (pageObservers.length > 0) {
      log(`disconnecting ${pageObservers.length} page observer${s(pageObservers.length)}`)
      pageObservers.forEach(observer => observer.disconnect())
      pageObservers = []
    }

    currentPage = title.split(' / ')[0]

    log('navigation occurred')

    if (currentPage == HOME || currentPage == LATEST_TWEETS) {
      if (config.hideRetweets) {
        observeTimeline(currentPage)
      }
    }
    if (config.hideSidebarContent) {
       hideSidebarContents(currentPage)
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

function observeTimeline(page) {
  var $timeline = document.querySelector('div[aria-label^="Timeline"]')
  var $firstTweet = document.querySelector('div[data-testid="tweet"]')

  if ($timeline == null ||
      $timeline.firstElementChild == null ||
      $timeline.firstElementChild.firstElementChild == null ||
      $firstTweet == null) {
    if (currentPage != page) {
      return log('stopped waiting for ${page} timeline')
    }
    return setTimeout(observeTimeline, 1000 / 60 * 5, page)
  }

  function processTweets() {
    let tweets = document.querySelectorAll('div[data-testid="tweet"]')
    log(`processing ${tweets.length} tweet${s(tweets.length)}`)
    for (let $tweet of tweets) {
      let isRetweet = $tweet.previousElementSibling &&
                      $tweet.previousElementSibling.textContent.includes('Retweeted')
      if (isRetweet) {
        $tweet.parentNode.parentNode.parentNode.style.display = 'none'
      }
    }
  }

  // Watch for new tweets being rendered
  log('observing timeline childList')
  processTweets()
  let $tweetContainer = $timeline.firstElementChild.firstElementChild
  let observer = new MutationObserver(processTweets)
  observer.observe($tweetContainer, {
    childList: true
  })
  pageObservers.push(observer)
}

// TODO Re-trigger removal when the horizontal breakpoint is hit while resizing
function hideSidebarContents(page, attempts = 1) {
  let $trending = document.querySelector('div[data-testid="sidebarColumn"] section')
  if ($trending) {
    let $trendingModule = $trending.parentNode.parentNode.parentNode
    $trendingModule.style.display = 'none'
    // Hide surrounding elements which draw separators between modules
    if ($trendingModule.previousElementSibling &&
        $trendingModule.previousElementSibling.childElementCount == 0) {
      $trendingModule.previousElementSibling.style.display = 'none'
    }
    if ($trendingModule.nextElementSibling &&
        $trendingModule.nextElementSibling.childElementCount == 0) {
      $trendingModule.nextElementSibling.style.display = 'none'
    }
  }

  let $people = document.querySelector('div[data-testid="sidebarColumn"] aside')
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

  if ($trending == null || $people == null) {
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
      `nav[aria-label="Primary"] div[dir="auto"] span { font-size: ${fontSize}; font-weight: normal; }`,
      'nav[aria-label="Primary"] div[dir="auto"] { margin-top: -4px; }'
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
  if (config.hideRetweets || config.hideSidebarContents) {
    observeTitle()
  }
}

chrome.storage.local.get((storedConfig) => {
  config = {...config, ...storedConfig}
  main()
})
