/* @flow */

import type { AccountVerificationPage } from '../types';
import type { PureAction } from '../../typesDEPRECATED/redux';

export type State = {
  +didCompleteInitialSearch: boolean,
  +page: AccountVerificationPage | null,
  +providerSearchText: string,
};

const DEFAULT_STATE: State = {
  didCompleteInitialSearch: false,
  page: null,
  providerSearchText: '',
};

export default function accountVerification(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'EXIT_ACCOUNT_VERIFICATION': {
      return { ...state, page: null };
    }

    case 'FETCH_PROVIDERS_SUCCESS':
    case 'FETCH_PROVIDERS_FAILURE': {
      return { ...state, didCompleteInitialSearch: true };
    }

    case 'REQUEST_PROVIDER_LOGIN': {
      return {
        ...state,
        page: { type: 'LOGIN', providerID: action.providerID },
      };
    }

    case 'REQUEST_PROVIDER_SEARCH': {
      return {
        ...state,
        page: { type: 'SEARCH' },
      };
    }

    case 'UPDATE_PROVIDER_SEARCH_TEXT': {
      return {
        ...state,
        providerSearchText: action.searchText,
      };
    }
  }
  return state;
}
