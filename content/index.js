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

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

function cleanupWhitespace(content: string): string {
  return content.replace(/\s+/g, ' ').trim();
}
