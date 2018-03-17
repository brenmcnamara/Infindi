/* @flow */

import { DEFAULT_TAB_NAME } from '../common/route-utils';

import type { ID } from 'common/types/core';
import type { PureAction } from '../typesDEPRECATED/redux';
import type { TabName } from '../common/route-utils';

export type RequestedTransactions =
  | {| +type: 'NO' |}
  | {| +accountID: ID, +type: 'YES' |};

export type State = {
  +requestedTabName: TabName,
  +requestedTransactions: RequestedTransactions,
};

const DEFAULT_STATE: State = {
  requestedTabName: DEFAULT_TAB_NAME,
  requestedTransactions: { type: 'NO' },
};

export default function routeState(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'REQUEST_TAB':
      return { ...state, requestedTabName: action.tabName };
    case 'REQUEST_TRANSACTIONS':
      return {
        ...state,
        requestedTransactions: { accountID: action.accountID, type: 'YES' },
      };
  }
  return state;
}
