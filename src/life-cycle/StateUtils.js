/* @flow */

import invariant from 'invariant';
import nullthrows from 'nullthrows';

import type { ReduxState } from '../store';

function didLoadAccounts(reduxState: ReduxState): boolean {
  const account = reduxState.account;
  invariant(
    account.listenerStateMap.size <= 1,
    'Expecting at most 1 listener for accounts',
  );
  if (account.listenerStateMap.size === 0) {
    return false;
  }
  const listenerState = nullthrows(account.listenerStateMap.first());
  return listenerState.loadState.type === 'STEADY';
}

function didLoadAccountLinks(reduxState: ReduxState): boolean {
  const accountLink = reduxState.accountLink;
  invariant(
    accountLink.listenerStateMap.size <= 1,
    'Expecting at most 1 listener for account links',
  );
  if (accountLink.listenerStateMap.size === 0) {
    return false;
  }
  const listenerState = nullthrows(accountLink.listenerStateMap.first());
  return listenerState.loadState.type === 'STEADY';
}

export default {
  didLoadAccountLinks,
  didLoadAccounts,
};
