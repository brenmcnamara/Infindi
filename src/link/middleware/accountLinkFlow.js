/* @flow */

import invariant from 'invariant';

import { AccountsDownloadingBanner, AccountLinkBanner } from '../../../content';
import { dismissAccountVerification, PROVIDER_LOGIN_MODAL_ID } from '../action';
import { dismissToast, requestToast } from '../../actions/toast';
import { isLinking } from 'common/lib/models/AccountLink';
import { forEachObject } from '../../common/obj-utils';

import type { AccountLink } from 'common/lib/models/AccountLink';
import type { ID } from 'common/types/core';
import type { ModelCollection } from '../../datastore';
import type { PureAction, Next, Store } from '../../typesDEPRECATED/redux';
import type { State as ReduxState } from '../../reducers/root';

type AccountLinkCollection = ModelCollection<'AccountLink', AccountLink>;

const REFRESH_ACCOUNTS_DOWNLOADING_TOAST_ID = 'YODLEE_ACCOUNTS_DOWNLOADING';

type AccountLinkPhase =
  | {
      type: | 'INITIALIZING'
        | 'VERIFYING_CREDENTIALS'
        | 'IN_PROGRESS'
        | 'SUCCESS',
    }
  | { error: Object, type: 'FAILURE_GENERAL' | 'FAILURE_LOGIN' };

export default (store: Store) => (next: Next) => {
  const accountLinkPhaseMap: { [id: ID]: AccountLinkPhase } = {};
  let isAccountsDownloadingBanner = false;
  // let failureBannerProviderLoginTimeoutID = null;

  function updateAccountLinkPhase(
    providerID: ID,
    toPhase: AccountLinkPhase,
  ): void {
    const fromPhase: AccountLinkPhase | null =
      accountLinkPhaseMap[providerID] || null;
    if (fromPhase === toPhase) {
      return;
    }

    const preVerificationPhases = ['INITIALIZING', 'VERIFYING_CREDENTIALS'];
    const postVerificationPhases = ['IN_PROGRESS', 'SUCCESS'];
    if (
      fromPhase &&
      preVerificationPhases.includes(fromPhase.type) &&
      postVerificationPhases.includes(toPhase.type) &&
      isShowingProviderLoginScreen(store.getState())
    ) {
      next(dismissAccountVerification());
    }

    next(
      requestAccountLinkBanner(
        providerID,
        toPhase,
        AccountLinkBanner[toPhase.type],
      ),
    );

    accountLinkPhaseMap[providerID] = toPhase;
  }

  function updateAccountsDownloading(
    nextIsAccountsDownloadingBanner: bool,
  ): void {
    if (isAccountsDownloadingBanner === nextIsAccountsDownloadingBanner) {
      return;
    }

    if (isAccountsDownloadingBanner) {
      next(dismissAccountsDownloadingBanner());
    }

    if (nextIsAccountsDownloadingBanner) {
      next(requestAccountsDownloadingBanner());
    }

    isAccountsDownloadingBanner = nextIsAccountsDownloadingBanner;
  }

  return (action: PureAction) => {
    next(action);

    switch (action.type) {
      case 'COLLECTION_DOWNLOAD_FINISHED': {
        if (action.modelName !== 'AccountLink') {
          break;
        }
        // $FlowFixMe - This is correct
        const collection: AccountLinkCollection = action.collection;
        forEachObject(collection, accountLink => {
          const providerID = accountLink.providerRef.refID;
          const accountLinkPhase = getAccountLinkPhase(accountLink);
          updateAccountLinkPhase(providerID, accountLinkPhase);
        });

        const shouldShowAccountsDownloadingBanner = containsLinking(collection);
        updateAccountsDownloading(shouldShowAccountsDownloadingBanner);
        break;
      }

      case 'REQUEST_PROVIDER_LOGIN': {
        // NOTE: There is an edge case we are not properly handling here. If
        // a provider sends a long request, we get the banner to show that
        // accounts are downloading. It could be the case that right after this
        // request is sent, before the refresh info for the provider is created
        // we have a refresh of the user's providers that won't include a new
        // refresh for this provider. If none of the refreshes show downloading
        // accounts, then the banner will get dismissed too early. This is
        // probably a very rare edge case and the bug does not result in any
        // serious issues with the app.
        const providerID = action.provider.id;
        updateAccountLinkPhase(providerID, { type: 'INITIALIZING' });
        break;
      }

      case 'REQUEST_PROVIDER_LOGIN_FAILED': {
        const providerID = action.provider.id;
        const { error } = action;
        updateAccountLinkPhase(providerID, { error, type: 'FAILURE_GENERAL' });
      }
    }
  };
};

function requestAccountsDownloadingBanner() {
  return requestToast({
    bannerChannel: 'ACCOUNTS',
    bannerType: 'INFO',
    id: REFRESH_ACCOUNTS_DOWNLOADING_TOAST_ID,
    priority: 'LOW',
    showSpinner: true,
    text: AccountsDownloadingBanner,
    toastType: 'BANNER',
  });
}

function dismissAccountsDownloadingBanner() {
  return dismissToast(REFRESH_ACCOUNTS_DOWNLOADING_TOAST_ID);
}

function requestAccountLinkBanner(
  providerID: ID,
  phase: AccountLinkPhase,
  text: string,
) {
  const id = `PROVIDERS/${providerID}`;
  return requestToast({
    bannerChannel: id,
    bannerType:
      phase.type === 'FAILURE_GENERAL' || phase.type === 'FAILURE_LOGIN'
        ? 'ERROR'
        : phase.type === 'SUCCESS' ? 'SUCCESS' : 'INFO',
    id,
    priority: 'LOW',
    showSpinner:
      phase.type !== 'FAILURE_GENERAL' &&
      phase.type !== 'FAILURE_LOGIN' &&
      phase.type !== 'SUCCESS',
    text,
    toastType: 'BANNER',
  });
}

// function dismissAccountLinkBanner(providerID: ID) {
//   return dismissToast(`PROVIDERS/${providerID}`);
// }

function containsLinking(collection: AccountLinkCollection): bool {
  for (const id in collection) {
    if (collection.hasOwnProperty(id) && isLinking(collection[id])) {
      return true;
    }
  }
  return false;
}

function getAccountLinkPhase(accountLink: AccountLink): AccountLinkPhase {
  const { sourceOfTruth } = accountLink;
  invariant(
    sourceOfTruth.type === 'YODLEE',
    'Expecting account link to come from YODLEE',
  );

  const { refreshInfo } = sourceOfTruth.providerAccount;

  if (refreshInfo.status === 'IN_PROGRESS') {
    return refreshInfo.additionalStatus === 'LOGIN_IN_PROGRESS'
      ? { type: 'VERIFYING_CREDENTIALS' }
      : { type: 'IN_PROGRESS' };
  }
  if (refreshInfo.status === 'FAILED') {
    const isLoginFailure = refreshInfo.additionalStatus === 'LOGIN_FAILED';
    const error = {
      errorCode: 'infindi/unknown-error',
      errorMessage: isLoginFailure
        ? AccountLinkBanner.FAILURE_LOGIN
        : AccountLinkBanner.FAILURE_GENERAL,
    };
    return {
      error,
      type: isLoginFailure ? 'FAILURE_LOGIN' : 'FAILURE_GENERAL',
    };
  }
  return { type: 'SUCCESS' };
}

function isShowingProviderLoginScreen(state: ReduxState): bool {
  const { modalQueue } = state.modalState;
  return modalQueue.length > 0 && modalQueue[0].id === PROVIDER_LOGIN_MODAL_ID;
}
