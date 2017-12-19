/* @flow */

import type { PureAction } from '../typesDEPRECATED/redux';

export type State = {|
  +isLinkAvailable: bool,
  +hasDownloadRequests: bool,
|};

const DEFAULT_STATE: State = {
  hasDownloadRequests: false,
  isLinkAvailable: true,
};

export default function plaid(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'PLAID_HAS_DOWNLOAD_REQUESTS': {
      return { ...state, hasDownloadRequests: action.hasDownloadRequests };
    }

    case 'PLAID_LINK_AVAILABILITY': {
      return { ...state, isLinkAvailable: action.isAvailable };
    }
  }
  return state;
}
