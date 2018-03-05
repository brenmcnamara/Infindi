/* @flow */

import invariant from 'invariant';

import type { AccountLink } from 'common/lib/models/AccountLink';
import type { ID } from 'common/types/core';
import type { ModelCollection } from '../../datastore';
import type { Provider } from 'common/lib/models/Provider';
import type { PureAction } from '../../typesDEPRECATED/redux';

export type State = {
  +providerPendingLogin: Provider | null,
};

type AccountLinkCollection = ModelCollection<'AccountLink', AccountLink>;

const DEFAULT_STATE = {
  providerPendingLogin: null,
};

export default function provider(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'REQUEST_PROVIDER_LOGIN': {
      // TODO: This is lame! Fix it!
      invariant(
        !state.providerPendingLogin,
        'Only supports 1 pending login at a time',
      );
      return { ...state, providerPendingLogin: action.provider };
    }

    case 'REQUEST_PROVIDER_LOGIN_FAILED': {
      invariant(
        state.providerPendingLogin,
        'Expecting pending login on provider',
      );
      return { ...state, providerPendingLogin: null };
    }

    case 'COLLECTION_DOWNLOAD_FINISHED': {
      if (!state.providerPendingLogin) {
        return state;
      }
      const providerID = state.providerPendingLogin.id;
      if (action.modelName !== 'AccountLink') {
        return state;
      }
      // $FlowFixMe - This is correct.
      const collection: AccountLinkCollection = action.collection;
      const accountLink = getAccountLinkForProvider(collection, providerID);
      if (!accountLink) {
        return state;
      }
      return { ...state, providerPendingLogin: null };
    }
  }
  return state;
}

function getAccountLinkForProvider(
  accountLinkCollection: AccountLinkCollection,
  providerID: ID,
): AccountLink | null {
  for (const id in accountLinkCollection) {
    if (
      accountLinkCollection.hasOwnProperty(id) &&
      accountLinkCollection[id].providerRef.refID === providerID
    ) {
      return accountLinkCollection[id];
    }
  }
  return null;
}
