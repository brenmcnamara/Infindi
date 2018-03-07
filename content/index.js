/* @flow */

/**
 * Content that shows when the user is on the accounts page, but they have
 * no accounts yet.
 */
export const AccountNullState = cleanupWhitespace(`
  Adding accounts allows us to give you the best advice possible. We use the
  information from your accounts to track your net worth, help you budget,
  and give you tailored recommendations.
`);

export const AccountGroupInfo = {
  /**
   * Basic information explaining to the user what an "AVAILABLE CASH" account
   * is. A couple of sentences, assuming very basic knowledge about finances.
   */
  AVAILABLE_CASH: cleanupWhitespace(`
    Cash you have available at any moment's notice. You can access this cash
    right away for bill payments and emergencies.
  `),

  /**
   * Explain what the 'CHARITY' category is for in a few sentences.
   */
  CHARITY: cleanupWhitespace(`
    This represents any charitable accounts you have set up. This is not
    included in your net worth.
  `),

  /**
   * Explain what the 'CREDIT CARD DEBT' category is for in a few sentences.
   */
  CREDIT_CARD_DEBT: cleanupWhitespace(`
    Debt you owe on your credit cards. Late credit card payments often accrue at
    very high interest rates.
  `),

  /**
   * Basic information explaining to the user what an "DEBT" account is.
   * A couple of sentences, assuming very basic knowledge about finances.
   */
  DEBT: cleanupWhitespace(`
    Debt you owe excluding credit card debt. Make sure you have a plan to pay it
    off.
  `),

  /**
   * Explain what the 'LIQUID INVESTMENTS' category is for in a few sentences.
   */
  LIQUID_INVESTMENTS: cleanupWhitespace(`
    Investments that take a few days or fewer to be converted into cash
  `),

  /**
   * Explain what the 'NON LIQUID INVESTMENTS' category is for in a few sentences.
   */
  NON_LIQUID_INVESTMENTS: cleanupWhitespace(`
    Investments that take more than a few days to be converted into cash.
  `),

  /**
   * Explain what the 'OTHER' category is for in a few sentences.
   */
  OTHER: cleanupWhitespace(`
    Accounts that do not fall into the above categories end up here.
  `),

  /**
   * Explain what the 'RETIREMENT' category is for in a few sentences.
   */
  RETIREMENT: cleanupWhitespace(`
    Investments that you can typically access only after turning 60.5 years old.
    There are some cases in which you can access these funds earlier. Retirement
    accounts are usually tax-advantaged.
  `),

  /**
   * Explain what the 'REWARDS' category is for in a few sentences.
   */
  REWARDS: cleanupWhitespace(`
    Rewards from credit cards, airlines, and other loyalty programs.
  `),
};

/**
 * Shows when a user is not connected to the internet and is required to connect
 * before they can do anything in the app.
 */
export const NoInternet = cleanupWhitespace(`
  You have no internet connection. You must connect before continuing in the
  app.
`);

/**
 * Message that shows when the user has no action items on the home page.
 */
export const ActionItemPagerNullState = cleanupWhitespace(`
  We have no news for you at the moment.
`);

/**
 * Displayed in a banner at the top of the accounts screen when the user's
 * accounts are downloading.
 */
export const AccountsDownloadingBanner = cleanupWhitespace(`
  Downloading accounts...
`);

/**
 * Message to be shown at different points of the provider login process.
 * These are displayed in banners and must be very short.
 */
export const ProviderLoginBanner = {
  FAILURE: cleanupWhitespace(`
    The last login attempt failed
  `),

  INITIALIZING: cleanupWhitespace(`
    Setting up the link
  `),

  LINKING: cleanupWhitespace(`
    Downloading data. This may take a moment...
  `),

  SUCCESS: cleanupWhitespace(`
    You are logged into this account
  `),
};

export const ProviderSearchError = cleanupWhitespace(`
  There is an issue with our service. Please try again later.
`);

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

function cleanupWhitespace(content: string): string {
  return content.replace(/\s+/g, ' ').trim();
}
