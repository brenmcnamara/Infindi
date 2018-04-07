/* @flow */

import { DEFAULT_TAB_NAME } from '../common/route-utils';

import type { ID } from 'common/types/core';
import type { PureAction } from '../typesDEPRECATED/redux';
import type { TabName } from '../common/route-utils';

export type State = {
  +accountDetailsID: ID | null,
  +tabName: TabName,
};

const DEFAULT_STATE: State = {
  accountDetailsID: null,
  tabName: DEFAULT_TAB_NAME,
};

export default function routeState(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'EXIT_ACCOUNT_DETAILS':
      return {
        ...state,
        accountDetailsID: null,
      };

    case 'VIEW_TAB':
      return { ...state, tabName: action.tabName };

    case 'VIEW_ACCOUNT_DETAILS':
      return {
        ...state,
        accountDetailsID: action.accountID,
      };
  }
  return state;
}
