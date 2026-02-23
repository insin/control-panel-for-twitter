import fs from 'node:fs'

import clipboard from 'clipboardy'

let extraTranslations = {
  "desktopVersion": {
    "en": " (desktop version)",
    "es": " (versión de escritorio)",
    "fr": " (version de bureau)",
    "it": " (versione desktop)",
    "ja": "（デスクトップ版）",
    "ko": " (데스크톱 버전)",
    "zh_CN": "（桌面版）"
  },
  "mobileVersion": {
    "en": " (mobile version)",
    "es": " (versión móvil)",
    "fr": " (version mobile)",
    "it": " (versione mobile)",
    "ja": "（モバイル版）",
    "ko": " (모바일 버전)",
    "zh_CN": "（手机版）"
  }
}

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
// Add extra translations
Object.assign(messages, Object.fromEntries(Object.entries(extraTranslations).map(([prop, value]) => [prop, value[localeCode]])))

let storeDescription = `
${messages.features}

${messages.homeTimelineOptions}:

• ${messages.defaultToFollowing}
• ${messages.hideForYouTimeline}
• ${messages.defaultFollowingToRecent} / ${messages.hideFollowingMenu}
• ${messages.retweets} (${messages.option_separate} / ${messages.option_hide})
• ${messages.quoteTweets} (${messages.option_separate} / ${messages.option_hide})
• ${messages.mutableQuoteTweets}
• ${messages.hideSeeNewTweets}
• ${messages.hideSuggestedContentTimeline}
• ${messages.hideInlinePrompts}
• ${messages.fullWidthContent}${messages.desktopVersion} - ${messages.fullWidthContentInfo}

${messages.uiImprovementsOptions}:

• ${messages.preventNextVideoAutoplay}${messages.mobileVersion}
• ${messages.addAddMutedWordMenuItem_desktop}
• ${messages.fastBlock}
• ${messages.hideUnavailableQuoteTweets}
• ${messages.hideProfileRetweets}
• ${messages.hideNotificationLikes}
• ${messages.hideNotificationRetweets}
• ${messages.hideListRetweets}
• ${messages.hideSuggestedContentSearch}
• ${messages.defaultToLatestSearch}
• ${messages.tweakQuoteTweetsPage}

${messages.xFixesOptions}:

• ${messages.revertXBranding}
• ${messages.darkModeTheme} (${messages.option_dim})
• ${messages.redirectToTwitter}
• ${messages.redirectChatNav}
• ${messages.hideViews}
• ${messages.hideVerifiedTabs}
• ${messages.restoreTweetSource}
• ${messages.addFocusedTweetAccountLocation}
• ${messages.addUserHoverCardAccountLocation}${messages.desktopVersion}
• ${messages.restoreLinkHeadlines}
• ${messages.restoreQuoteTweetsLink}
• ${messages.restoreOtherInteractionLinks}
• ${messages.sortReplies} (${messages.option_recent} / ${messages.option_liked})
• ${messages.hideSortRepliesMenu}
• ${messages.premiumBlueChecks} (${messages.premiumBlueChecksOption_replace} / ${messages.option_hide})
• ${messages.hidePremiumReplies}
• ${messages.hidePremiumUpsells}
• ${messages.hideGrok}
• ${messages.hideGrokTweets}
• ${messages.hideEditImage}
• ${messages.hideJobs}
• ${messages.hideSubscriptions}

${messages.uiTweaksOptions}:

• ${messages.dontUseChirpFont}
• ${messages.disableTweetTextFormatting}
• ${messages.navBaseFontSize}${messages.desktopVersion}
• ${messages.navDensity}${messages.desktopVersion} (${messages.option_comfortable} / ${messages.option_compact})
• ${messages.dropdownMenuFontWeight}
• ${messages.uninvertFollowButtons} (${messages.followButtonStyleOption_monochrome} / ${messages.followButtonStyleOption_themed})
• ${messages.bypassAgeVerification}
• ${messages.unblurSensitiveContent}

${messages.reduceAlgorithmicContentOptions}:

• ${messages.hideSidebarContent}${messages.desktopVersion}
• ${messages.hideExplorePageContents}
• ${messages.hideDiscoverSuggestions}

${messages.reduceEngagementOptions}:

• ${messages.hideMetrics}
• ${messages.reducedInteractionMode} - ${messages.reducedInteractionModeInfo}
• ${messages.hideComposeTweet}
• ${messages.disableHomeTimeline} - ${messages.disableHomeTimelineInfo}
• ${messages.notifications} (${messages.option_badges} / ${messages.option_hide})

${messages.hideUnusedUiItemsOptions}:

• ${messages.hideBookmarkButton}
• ${messages.hideShareTweetButton}
• ${messages.hideViewActivityLinks}
• ${messages.hideTimelineTweetBox}${messages.desktopVersion}
• ${messages.hideAccountSwitcher}${messages.desktopVersion}
• ${messages.hideMessagesDrawer}${messages.desktopVersion}
• ${messages.hideExploreNav}${messages.desktopVersion}
• ${messages.hideCreatorStudioNav}
• ${messages.hideConnectNav}
• ${messages.hideCommunitiesNav}
• ${messages.hideMoreSlideOutMenuItemsOptions_desktop}
`.trim()

if (process.argv[3] == 'md') {
  storeDescription = storeDescription
    // Section titles
    .replace(/^([^:\n]+):$/gm, '**$1:**')
    // List items
    // .replace(/•/g, '-')
}

storeDescription += '\n\nTWITTER, TWEET and RETWEET are trademarks of Twitter Inc. or its affiliates'

clipboard.writeSync(storeDescription)
console.log(storeDescription)