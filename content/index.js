/* @flow */

/**
 * Content that shows when the user is on the accounts page, but they have
 * no accounts yet.
 */
export const AccountNullState = cleanupWhitespace(`
  One to two sentences on why it is important to add accounts. Should convey
  that we need account info for this app to be useful.
`);

export const AccountGroupInfo = {
  /**
   * Basic information explaining to the user what an "AVAILABLE CASH" account
   * is. A couple of sentences, assuming very basic knowledge about finances.
   */
  AVAILABLE_CASH: cleanupWhitespace(`
    One to two sentences on what an account labeled under available cash means.
    Should assume only basic knowledge of finances.
  `),

  /**
   * Explain what the 'INVESTMENTS' category is for in a few sentences.
   */
  INVESTMENTS: cleanupWhitespace(`
    One to two sentences on what an account labeled under investments means.
  `),

  /**
   * Explain what the 'OTHER' category is for in a few sentences.
   */
  OTHER: cleanupWhitespace(`
    One to two sentences explaining the other category.
  `),

  /**
   * Basic information explaining to the user what an "SHORT TERM DEBT" account
   * is. A couple of sentences, assuming very basic knowledge about finances.
   */
  SHORT_TERM_DEBT: cleanupWhitespace(`
     One to two sentences on what an account labeled under available cash means.
     Should assume only basic knowledge of finances.
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
  Only one sentence explaining that the user has no action items at the
  moment.
`);

/**
 * Displayed in a banner at the top of the accounts screen when the user's
 * accounts are downloading.
 */
export const AccountsDownloadingBanner = cleanupWhitespace(`
  Your accounts are downloading
`);

/**
 * Message to be shown at different points of the provider login process.
 * These are displayed in banners and must be very short.
 */
export const ProviderLoginBanner = {
  ERROR: cleanupWhitespace(`
    Login attempt failed.
  `),

  IN_PROGRESS: cleanupWhitespace(`
    Logging in. This may take a moment...
  `),

  SUCCESS: cleanupWhitespace(`
    You are already logged in
  `),
};

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

function cleanupWhitespace(content: string): string {
  return content.replace(/\s+/g, ' ').trim();
}
