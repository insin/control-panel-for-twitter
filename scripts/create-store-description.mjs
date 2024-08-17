import fs from 'node:fs'

import clipboard from 'clipboardy'

let localeCode = process.argv[2]

if (!localeCode) {
  console.log(`
Usage:
  npm run create-store-description ja
  npm run create-store-description ja html
`.trim())
  process.exit(1)
}

let locale = JSON.parse(fs.readFileSync(`./_locales/${localeCode}/messages.json`, {encoding: 'utf8'}))
let messages = Object.fromEntries(Object.entries(locale).map(([prop, value]) => ([prop, value.message])))

let storeDescription = `
${messages.homeTimelineOptionsLabel}

• ${messages.alwaysUseLatestTweetsLabel}
  • ${messages.hideForYouTimelineLabel}
• ${messages.retweetsLabel}
  • ${messages.option_separate}
• ${messages.mutableQuoteTweetsLabel}
  • ${messages.mutableQuoteTweetsInfo}
• ${messages.hideSeeNewTweetsLabel}
• ${messages.hideWhoToFollowEtcLabel}
• ${messages.hideInlinePrompts}
• ${messages.fullWidthContentLabel}
  • ${messages.fullWidthContentInfo}

${messages.uiImprovementsOptionsLabel}

• ${messages.addAddMutedWordMenuItemLabel_desktop}
• ${messages.fastBlockLabel}
• ${messages.hideUnavailableQuoteTweetsLabel}
• ${messages.hideProfileRetweetsLabel}
• ${messages.listRetweetsLabel}
• ${messages.defaultToLatestSearchLabel}
• ${messages.tweakQuoteTweetsPageLabel}

${messages.xFixesLabel}

• ${messages.replaceLogoLabel}
• ${messages.hideViewsLabel}
• ${messages.hideVerifiedNotificationsTabLabel}
• ${messages.restoreLinkHeadlinesLabel}
• ${messages.restoreQuoteTweetsLinkLabel}
• ${messages.sortRepliesLabel}
• ${messages.twitterBlueChecksLabel}
  • ${messages.twitterBlueChecksOption_replace}
• ${messages.hideTwitterBlueRepliesLabel}
• ${messages.hideTwitterBlueUpsellsLabel}
• ${messages.hideGrokLabel}
• ${messages.hideJobsLabel}
• ${messages.hideSubscriptionsLabel}

${messages.uiTweaksOptionsLabel}

• ${messages.dontUseChirpFontLabel}
• ${messages.disableTweetTextFormattingLabel}
• ${messages.navBaseFontSizeLabel}
• ${messages.navDensityLabel}
  • ${messages.option_comfortable} / ${messages.option_compact}
• ${messages.dropdownMenuFontWeightLabel}
• ${messages.uninvertFollowButtonsLabel}
  • ${messages.followButtonStyleOption_monochrome} / ${messages.followButtonStyleOption_themed}

${messages.reduceAlgorithmicContentOptionsLabel}

• ${messages.hideSidebarContentLabel}
• ${messages.hideExplorePageContentsLabel}
• ${messages.hideMoreTweetsLabel}

${messages.reduceEngagementOptionsLabel}

• ${messages.hideMetricsLabel}
• ${messages.reducedInteractionModeLabel}
  • ${messages.reducedInteractionModeInfo}
• ${messages.disableHomeTimelineLabel}
  • ${messages.disableHomeTimelineInfo}

${messages.hideUnusedUiItemsOptionsLabel}

• ${messages.hideBookmarkButtonLabel}
• ${messages.hideShareTweetButtonLabel}
• ${messages.hideTimelineTweetBoxLabel}
• ${messages.hideTimelineTweetBoxLabel}
• ${messages.hideAccountSwitcherLabel}
• ${messages.hideMessagesDrawerLabel}
• ${messages.hideMoreSlideOutMenuItemsOptionsLabel_desktop}
`.trim()

if (process.argv[3] == 'html') {
  // XXX This depends _very specifically_ on the way dashes, spaces and newlines
  //     are used in the template string above.
  storeDescription = `<strong>${messages.features}:</strong>\n\n` + storeDescription
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
} else {
  storeDescription = `${messages.features}:\n\n` + storeDescription
}

storeDescription += '\n\nTWITTER, TWEET and RETWEET are trademarks of Twitter Inc. or its affiliates'

clipboard.writeSync(storeDescription)
console.log(storeDescription)