/* @flow */

import AccountLinkStateUtils from '../data-model/_state-utils/AccountLink';

import type AccountLink from 'common/lib/models/AccountLink';
import type Provider from 'common/lib/models/Provider';

import type { ID } from 'common/types/core';
import type { ReduxState } from '../store';

function getProviders(state: ReduxState): Array<Provider> {
  return state.providers.ordering.map(id => state.providers.container[id]);
}

function getAccountLinkForProviderID(
  reduxState: ReduxState,
  providerID: ID,
): AccountLink | null {
  return (
    AccountLinkStateUtils.getCollection(reduxState).find(
      accountLink => accountLink.providerRef.refID === providerID,
    ) || null
  );
}

export default {
  getAccountLinkForProviderID,
  getProviders,
};
