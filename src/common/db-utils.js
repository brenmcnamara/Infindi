/* @flow */

import invariant from 'invariant';

import type { Account } from 'common/src/types/db';
import type { AccountLoader } from '../reducers/accounts';

export type GroupType = 'AVAILABLE_CASH' | 'SHORT_TERM_DEBT' | 'OTHER';

export function getGroupTypeForAccountLoader(loader: AccountLoader): GroupType {
  invariant(loader.type === 'STEADY', 'Only supporting steady account loaders');
  return getGroupTypeForAccount(loader.model);
}

export function getGroupTypeForAccount(account: Account): GroupType {
  invariant(
    account.sourceOfTruth.type === 'PLAID',
    'Only support plaid accounts',
  );
  const plaidAccount = account.sourceOfTruth.value;
  switch (plaidAccount.subtype) {
    case 'checking':
    case 'savings':
      return 'AVAILABLE_CASH';
    case 'credit card':
      return 'SHORT_TERM_DEBT';
    case 'cd':
    default:
      return 'OTHER';
  }
}

export function formatGroupType(groupType: GroupType): string {
  return (
    groupType
      .split('_')
      // Capitalize first letter only.
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  );
}

export function getFormattedAccountType(account: Account): string {
  invariant(
    account.sourceOfTruth.type === 'PLAID',
    'Only support plaid accounts',
  );
  const plaidAccount = account.sourceOfTruth.value;
  return plaidAccount.subtype.trim().toUpperCase();
}
