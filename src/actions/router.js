/* @flow */

import type { ID } from 'common/types/core';
import type { TabName } from '../common/route-utils';

export type Action = Action$RequestTab | Action$RequestTransactions;

export type Action$RequestTab = {|
  +tabName: TabName,
  +type: 'REQUEST_TAB',
|};

export type Action$RequestTransactions = {|
  +accountID: ID,
  +type: 'REQUEST_TRANSACTIONS',
|};

export function requestTab(tabName: TabName) {
  return {
    tabName,
    type: 'REQUEST_TAB',
  };
}
