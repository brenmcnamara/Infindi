/* @flow */

import type { ID } from 'common/types/core';
import type { TabName } from '../common/route-utils';

export type Action =
  | Action$ViewTab
  | Action$ViewAccountDetails
  | Action$ExitAccountDetails;

export type Action$ViewTab = {|
  +tabName: TabName,
  +type: 'VIEW_TAB',
|};

export type Action$ViewAccountDetails = {|
  +accountID: ID,
  +type: 'VIEW_ACCOUNT_DETAILS',
|};

export type Action$ExitAccountDetails = {|
  +type: 'EXIT_ACCOUNT_DETAILS',
|};

export function viewTab(tabName: TabName) {
  return {
    tabName,
    type: 'VIEW_TAB',
  };
}

export function viewAccountDetails(accountID: ID) {
  return {
    accountID,
    type: 'VIEW_ACCOUNT_DETAILS',
  };
}

export function exitAccountDetails() {
  return {
    type: 'EXIT_ACCOUNT_DETAILS',
  };
}
