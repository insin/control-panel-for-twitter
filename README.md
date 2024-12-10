# Control Panel for Twitter

![](icons/icon128.png)

**Control Panel for Twitter is a browser extension which gives you more control over Twitter and adds missing features and UI improvements**

## Install

* [Safari Extension](https://apps.apple.com/app/id1668516167?platform=iphone) - for iPhone, iPad and Mac

  [![Download on the App Store](promo/app-store.png)](https://apps.apple.com/app/id1668516167?platform=iphone)
* [Firefox Extension](https://addons.mozilla.org/firefox/addon/control-panel-for-twitter/) - can also be installed in the Android version of Firefox
* [Chrome Extension](https://chrome.google.com/webstore/detail/control-panel-for-twitter/kpmjjdhbcfebfjgdnpjagcndoelnidfj) - can also be installed in Edge, Opera, and Brave on desktop, and [Kiwi Browser](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser) on Android
* [Edge Add-on](https://microsoftedge.microsoft.com/addons/detail/control-panel-for-twitter/foccddlibbeccjiobcnakipdpkjiijjp)
* [User script version](https://greasyfork.org/en/scripts/387773-control-panel-for-twitter) - requires a [user script manager](https://greasyfork.org/en#home-step-1)

## Releases / What's New?

The [Control Panel for Twitter Releases page](https://github.com/insin/control-panel-for-twitter/releases) highlights new features, changes and fixes in each version, and shows which version is currently published on each of the browser extension stores.

New versions can take anything from minutes to days to be approved for publishing after they're submitted to a browser extension store.

## Features

### Home timeline

- Defaults to the "Following" (chronological) timeline, automatically switching you back if Twitter tries to move you to the "For you" (algorithmic) timeline
- Hide the "For you" timeline tab (default setting)
- Move Retweets to a separate tab (default setting), or hide them entirely
- Move Quote Tweets and replies to them to a separate tab in the Home timeline, or hide them entirely
- Hide Retweets in pinned Lists
- Enable muting of Quote Tweets
- Hide the floating "See new Tweets" button
- Hide "Who to follow", "Follow some Topics" etc. in the Home timeline and elsewhere
- Hide inline prompts in the timeline
- Full-width timeline: hide the sidebar and let timeline content go full-width on Home, Lists and Communities

### UI improvements

- Add "Add muted word" to the "More" menu (desktop) or slide-out menu (mobile)
- Fast blocking - skips the confirm dialog when you try to block an account
- Hide quotes of and replies to blocked and muted accounts
- Hide Retweets in user profiles
- Default to "Latest" tab in Search
- When viewing a tweet's Quote Tweets, hide the quoted tweet to make more room for quotes

### X fixes

- Replace X branding changes
- Hide Views under tweets
- Hide the "Verified" tab in Notifications and the "Verified Followers" tab in Followers/Following
- Restore headlines under external links
- Restore the Quote Tweets link under tweets, and other interaction links
- Default sorting replies to most recent or most liked
- Replace Premium blue checks with the Twitter Blue logo, or hide them altogether
- Hide Premium blue check replies in threads
- Hide Premium upsells throughout the app
- Hide Grok
- Hide Jobs
- Hide Subscriptions

### UI tweaks

- Disable use of the Chirp font if you don't like it
- Disable bold and italic text in tweets
- Use the site's normal text font style in the primary navigation menu on desktop to make it less distracting
- Change the navigation menu density on desktop to make it take less room
- Use normal font weight in dropdown menus - if everything's bold, nothing's bold
- Uninvert the Follow and Following buttons to make them less jarring
  - Choice of monochrome or themed (classic) styling for uninverted buttons

### Remove algorithmic content

- Hide sidebar contents
- Hide Explore page contents and use it only for searching
- Hide "Discover more" algorithmic tweets when viewing a tweet

### Reduce "engagement"

- Hide metrics
- Reduced interaction mode: hide the action bar under tweets – replies are now the only means of interacting
- Disable the home timeline: find yourself [wasting too much time on Twitter](https://world.hey.com/brecht/free-range-tweet-farming-9399f6e5)? Try preventing use of the home timeline, going to Notifications or Messages by default instead

### Hide UI items you don't use

- Bookmark button under tweets
- Share button under tweets
- Analytics links under your own tweets
- Hide navigation items you don't use on desktop, and other distracting screen elements such as the Messages drawer
- Hide the bottom nav item for Messages on mobile if you don't use it often
- Hide items you don't use in the "More" menu (desktop) or slide-out menu (mobile)

## Screenshots

### Home timeline with most tweaks enabled

| Desktop | Mobile |
| - | - |
| ![Screenshot of a desktop Twitter home timeline without Retweets, algorithmic timeline content, or sidebar content, with fewer navigation items and a less distracting navigation font style](screenshots/timeline.png) | ![Screenshot of a mobile Twitter home timeline without Retweets, algorithmic timeline content](screenshots/firefox_android_timeline.jpg) |

### Separate timeline for Retweets (default setting) and/or Quote Tweets

| Desktop | Mobile |
| - | - |
| ![Screenshot of the separate timeline Control Panel for Twitter adds to desktop Twitter, configured to separate Retweets from the rest of the home timeline](screenshots/shared_tweets.png) | ![Screenshot of the separate timeline Control Panel for Twitter adds to mobile Twitter, configured to separate Retweets from the rest of the home timeline](screenshots/firefox_android_shared_tweets.jpg) |

### Full-width timeline

| Desktop only |
| - |
| ![Screenshot of a Twitter timeline which takes up all the available width in the layout](screenshots/full_width_timeline.png) |

### Tidied-up menu, with instant access to "Add muted word"

| Desktop - "More" menu | Mobile - slide-out menu |
| - | - |
| ![Screenshot of the "More" menu on desktop Twitter, with most of the menu items removed and a new "Add muted word" menu item](screenshots/more_menu.png) | ![Screenshot of the slide-out menu on mobile Twitter, with most of the menu items removed and a new "Add muted word" menu item](screenshots/firefox_android_menu.jpg) |

### Hide metrics

| Desktop | Mobile |
| - | - |
| ![Scteenshot of a Twitter timeline with blank spaces where numbers for metrics should be](screenshots/hide_metrics.png) | ![Sceenshot of a mobile Twitter timeline with blank spaces where numbers for metrics should be](screenshots/firefox_android_hide_metrics.jpg) |

### Uninverted Follow buttons

| Monochrome | Themed |
| - | - |
| ![Uninverted Follow / Following buttons using the new monochrome Twitter style](screenshots/uninverted_follow_buttons_monochrome.png) | ![Uninverted Follow / Following buttons using the classic themed Twitter style](screenshots/uninverted_follow_buttons_themed.png) |

### Disable use of Chirp font

| Chirp on | Chirp off |
| - | - |
| ![A Twitter thread using the Chirp font](screenshots/chirp_on.png) | ![The same Twitter thread using the fallback system fonts](screenshots/chirp_off.png) |

### Improved Quote Tweets page

The quoted tweet is hidden, instead of being duplicated under every quote, leaving more room for quotes

| Desktop | Mobile |
| - | - |
| ![Screenshot of the improvements Control Panel for Twitter makes to Quote Tweet pages on desktop, showing quote content only instead of repeating the quoted tweet in every tweet](screenshots/quote_tweets.png) | ![Screenshot of the improvements Control Panel for Twitter makes to Quote Tweet pages on mobile, showing quote content only instead of repeating the quoted tweet in every tweet](screenshots/firefox_android_quote_tweets.jpg) |

### Reduced interaction mode

| Desktop | Mobile |
| - | - |
| ![Screenshot of a Twitter timeline with the action bar below each tweet completely missing](screenshots/reduced_interaction_mode.png) | ![Screenshot of a Twitter timeline in Firefox on Android with the action bar below each tweet completely missing](screenshots/firefox_android_reduced_interaction_mode.jpg) |

## Disable the home timeline

| Desktop | Mobile |
| - | - |
| ![Screenshot of Twitter without the Home navigation item](screenshots/disable_home_timeline.png) | ![Screenshot of Twitter in Firefox on Android without the Home navigation item](screenshots/firefox_android_disable_home_timeline.jpg) |

### Configurable via options popup and the extension options page

| Desktop | Mobile |
| - | - |
| ![Screenshot of the options popup in Chrome on desktop](screenshots/options_popup.png) | ![Screenshot of the options popup in Firefox on Android on Android](screenshots/firefox_android_options_popup.jpg) |

### No trends on Explore screen, just search

| Mobile |
| - |
| ![Screenshot of the Explore screen in mobile Twitter, with only the search part of the screen visible](screenshots/firefox_android_explore.jpg) |

### Language support

As of v2.2, all 48 of the display languages available on Twitter are supported, some examples:

| Gaeilge (Irish) | 日本語 (Japanese) | العربية (Arabic) |
| - | - | - |
| ![Screenshot of a desktop Twitter home timeline using Control Panel for Twitter, as Gaeilge](screenshots/irish.png) | ![Screenshot of a desktop Twitter home timeline using Control Panel for Twitter, in Japanese](screenshots/japanese.png) | ![Screenshot of a desktop Twitter home timeline using Control Panel for Twitter, in Arabic](screenshots/arabic.png) |

Options are also available in the following languages:

- French (translation by [@THEDARKK](https://github.com/THEDARKK))
- Japanese (translation by [@MitoKurato](https://github.com/MitoKurato))
- Korean
- Simplified Chinese (translation by [@CodeQiu](https://github.com/CodeQiu))
- Spanish (translation by [@rogama25](https://github.com/rogama25))

### User script support

 [Control Panel for Twitter is also available as a user script](https://greasyfork.org/en/scripts/387773-control-panel-for-twitter) – to change the default options, you'll need to edit the `config` object at the top of the script.

## Attribution

Icon adapted from "Ibis icon" by [Delapouite](https://delapouite.com/) from [game-icons.net](https://game-icons.net), [CC 3.0 BY](https://creativecommons.org/licenses/by/3.0/)
