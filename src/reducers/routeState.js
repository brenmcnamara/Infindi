/* @flow */

import type { PureAction } from '../typesDEPRECATED/redux';
import type { TabType } from '../common/route-utils';

export type State = {
  +requestedTab: TabType | null,
};

const DEFAULT_STATE: State = {
  requestedTab: null,
};

export default function routeState(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'REQUEST_TAB':
      return { ...state, requestedTab: action.tab };
  }
  return state;
}
