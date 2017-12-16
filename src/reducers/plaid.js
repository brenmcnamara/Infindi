/* @flow */

import type { PureAction } from '../typesDEPRECATED/redux';

export type State = {|
  +isLinkAvailable: bool,
|};

const DEFAULT_STATE: State = {
  isLinkAvailable: true,
};

export default function plaid(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'PLAID_LINK_AVAILABILITY': {
      return { ...state, isLinkAvailable: action.isAvailable };
    }
  }
  return state;
}
