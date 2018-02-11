/* @flow */

import invariant from 'invariant';

import type { ID } from 'common/types/core';
import type { ModelCollection } from '../../datastore';
import type { Provider as YodleeProvider } from 'common/lib/models/YodleeProvider';
import type { PureAction } from '../../typesDEPRECATED/redux';
import type { YodleeRefreshInfo } from 'common/lib/models/YodleeRefreshInfo';

export type State = {
  +providerPendingLogin: YodleeProvider | null,
};

type RefreshInfoCollection = ModelCollection<'YodleeRefreshInfo',
  YodleeRefreshInfo,>;

const DEFAULT_STATE = {
  providerPendingLogin: null,
};

export default function yodleeProvider(
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
      if (action.modelName !== 'YodleeRefreshInfo') {
        return state;
      }
      // $FlowFixMe - This is correct.
      const collection: RefreshInfoCollection = action.collection;
      const refreshInfo = getRefreshInfoForProvider(collection, providerID);
      if (!refreshInfo) {
        return state;
      }
      return { ...state, providerPendingLogin: null };
    }
  }
  return state;
}

function getRefreshInfoForProvider(
  refreshInfoCollection: RefreshInfoCollection,
  providerID: ID,
): YodleeRefreshInfo | null {
  for (const id in refreshInfoCollection) {
    if (
      refreshInfoCollection.hasOwnProperty(id) &&
      refreshInfoCollection[id].providerRef.refID === providerID
    ) {
      return refreshInfoCollection[id];
    }
  }
  return null;
}
