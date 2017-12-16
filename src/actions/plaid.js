/* @flow */

export type Action = Action$PlaidLinkAccount;

export type Action$PlaidLinkAccount = {|
  +type: 'PLAID_LINK_ACCOUNT',
|};

export function plaidLinkAccount() {
  return { type: 'PLAID_LINK_ACCOUNT' };
}
