/* @flow */

/**
 * Content that shows when the user is on the accounts page, but they have
 * no accounts yet.
 */
export const AccountNullState = cleanupWhitespace(`
  One to two sentences on why it is important to add accounts. Should convey
  that we need account info for this app to be useful.
`);

function cleanupWhitespace(content: string): string {
  return content.replace(/\s+/g, ' ').trim();
}
