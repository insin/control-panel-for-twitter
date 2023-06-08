// Usage:
//   npm run create-store-description ja
//   npm run create-store-description ja html
const fs = require('fs')

let localeCode = process.argv[2]
let locale = JSON.parse(fs.readFileSync(`./_locales/${localeCode}/messages.json`, {encoding: 'utf8'}))
let messages = Object.fromEntries(Object.entries(locale).map(([prop, value]) => ([prop, value.message])))

let storeDescription
with (messages) {
  storeDescription = `
${features}:

${homeTimelineOptionsLabel}

• ${alwaysUseLatestTweetsLabel}
  • ${hideForYouTimelineLabel}
• ${retweetsLabel}
  • ${option_separate}
• ${hideUnavailableQuoteTweetsLabel}
• ${mutableQuoteTweetsLabel}
  • ${mutableQuoteTweetsInfo}
• ${hideWhoToFollowEtcLabel}
• ${hideSeeNewTweetsLabel}
• ${fullWidthContentLabel}
  • ${fullWidthContentInfo}

${uiImprovementsOptionsLabel}

• ${hideViewsLabel}
• ${hideVerifiedNotificationsTabLabel}
• ${twitterBlueChecksLabel}
  • ${twitterBlueChecksOption_replace}
• ${addAddMutedWordMenuItemLabel_desktop}
• ${hideSubscriptionsLabel}
• ${fastBlockLabel}
• ${navBaseFontSizeLabel}
• ${dropdownMenuFontWeightLabel}

${uiTweaksOptionsLabel}

• ${dontUseChirpFontLabel}
• ${uninvertFollowButtonsLabel}
  • ${followButtonStyleOption_monochrome}
  • ${followButtonStyleOption_themed}
• ${defaultToLatestSearchLabel}
• ${tweakQuoteTweetsPageLabel}

${reduceAlgorithmicContentOptionsLabel}

• ${hideSidebarContentLabel}
• ${hideExplorePageContentsLabel}
• ${hideMoreTweetsLabel}

${reduceEngagementOptionsLabel}

• ${hideMetricsLabel}
• ${reducedInteractionModeLabel}
  • ${reducedInteractionModeInfo}
• ${disableHomeTimelineLabel}
  • ${disableHomeTimelineInfo}

${hideUnusedUiItemsOptionsLabel}

• ${hideBookmarkButtonLabel}
• ${hideShareTweetButtonLabel}
• ${hideAccountSwitcherLabel}
• ${hideMessagesDrawerLabel}
• ${hideMoreSlideOutMenuItemsOptionsLabel_desktop}
  `
}

if (process.argv[3] == 'html') {
  // XXX This depends _very specifically_ on the way dashes, spaces and newlines
  //     are used in the template string above.
  storeDescription = storeDescription.trim()
    // 2 nested items
    .replace(/^• ([^\n]+)\n  • ([^\n]+)\n  • ([^\n]+)/gm, '<li>$1<ul>\n<li>$2</li>\n<li>$3</li></ul></li>')
    // 1 nested item
    .replace(/^• ([^\n]+)\n  • ([^\n]+)/gm, '<li>$1<ul>\n<li>$2</li></ul></li>')
    // No nested items
    .replace(/^• ([^\n]+)/gm, '<li>$1</li>')
    // Section titles
    .replace(/^([^\n<][^\n]+)\n\n/gm, '<strong>$1</strong>\n<ul>\n')
    // Remaining empty lines
    .replace(/^$/gm, '</ul>\n')
    .replace(/$/, '\n</ul>')
}

console.log(storeDescription + '\nTWITTER, TWEET and RETWEET are trademarks of Twitter Inc. or its affiliates')