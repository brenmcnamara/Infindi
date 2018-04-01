/* @flow */

import { AccountsDownloadingBanner, AccountLinkBanner } from '../../../content';
import { dismissAccountVerification, PROVIDER_LOGIN_MODAL_ID } from '../action';
import { dismissToast, requestToast } from '../../actions/toast';
import { isLinking } from 'common/lib/models/AccountLink';
import { forEachObject } from '../../common/obj-utils';

import type {
  AccountLink,
  AccountLinkStatus,
} from 'common/lib/models/AccountLink';
import type { ID } from 'common/types/core';
import type { ModelContainer } from '../../datastore';
import type { PureAction, Next, Store } from '../../typesDEPRECATED/redux';
import type { State as ReduxState } from '../../reducers/root';

type AccountLinkContainer = ModelContainer<'AccountLink', AccountLink>;

const REFRESH_ACCOUNTS_DOWNLOADING_TOAST_ID = 'YODLEE_ACCOUNTS_DOWNLOADING';

export default (store: Store) => (next: Next) => {
  const accountLinkStatusMap: { [id: ID]: AccountLinkStatus } = {};
  let isAccountsDownloadingBanner = false;

  function updateAccountLinkStatus(
    providerID: ID,
    toStatus: AccountLinkStatus,
    bannerText: string,
  ): void {
    const fromStatus = accountLinkStatusMap[providerID] || null;
    if (fromStatus === toStatus) {
      return;
    }

    const preVerificationPhases = [
      'IN_PROGRESS / INITIALIZING',
      'IN_PROGRESS / USER_INPUT_REQUIRED',
      'IN_PROGRESS / VERIFYING_CREDENTIALS',
      'FAILURE / BAD_CREDENTIALS',
    ];
    const postVerificationPhases = [
      'IN_PROGRESS / DOWNLOADING_DATA',
      'SUCCESS',
      'FAILURE / INTERNAL_SERVICE_FAILURE',
      'FAILURE / EXTERNAL_SERVICE_FAILURE',
    ];
    if (
      fromStatus &&
      preVerificationPhases.includes(fromStatus) &&
      postVerificationPhases.includes(toStatus) &&
      isShowingProviderLoginScreen(store.getState())
    ) {
      next(dismissAccountVerification());
    }

    next(requestAccountLinkBanner(providerID, toStatus, bannerText));

    accountLinkStatusMap[providerID] = toStatus;
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
      case 'CONTAINER_DOWNLOAD_FINISHED': {
        if (action.modelName !== 'AccountLink') {
          break;
        }
        // $FlowFixMe - This is correct
        const container: AccountLinkContainer = action.container;
        forEachObject(container, accountLink => {
          const providerID = accountLink.providerRef.refID;
          const { status } = accountLink;
          updateAccountLinkStatus(
            providerID,
            accountLink.status,
            AccountLinkBanner[status],
          );
        });
        const shouldShowAccountsDownloadingBanner = containsLinking(container);
        updateAccountsDownloading(shouldShowAccountsDownloadingBanner);
        break;
      }

      case 'SUBMIT_YODLEE_LOGIN_FORM_INITIALIZE': {
        // NOTE: There is an edge case we are not properly handling here. If
        // a provider sends a long request, we get the banner to show that
        // accounts are downloading. It could be the case that right after this
        // request is sent, before the refresh info for the provider is created
        // we have a refresh of the user's providers that won't include a new
        // refresh for this provider. If none of the refreshes show downloading
        // accounts, then the banner will get dismissed too early. This is
        // probably a very rare edge case and the bug does not result in any
        // serious issues with the app.
        const { providerID } = action;
        const text = AccountLinkBanner['IN_PROGRESS / INITIALIZING'];
        updateAccountLinkStatus(providerID, 'IN_PROGRESS / INITIALIZING', text);
        break;
      }

      case 'SUBMIT_YODLEE_LOGIN_FORM_FAILURE': {
        const { error, providerID } = action;
        // $FlowFixMe - This is correct.
        const message: string =
          error.error_message ||
          error.message ||
          error.errorMessage ||
          AccountLinkBanner['FAILURE / INTERNAL_SERVICE_FAILURE'];
        updateAccountLinkStatus(
          providerID,
          'FAILURE / INTERNAL_SERVICE_FAILURE',
          message,
        );
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
  status: AccountLinkStatus,
  text: string,
) {
  const id = `PROVIDERS/${providerID}`;
  return requestToast({
    bannerChannel: id,
    bannerType: status.startsWith('FAILURE')
      ? 'ERROR'
      : status.startsWith('SUCCESS') ? 'SUCCESS' : 'INFO',
    id,
    priority: 'LOW',
    showSpinner: status.startsWith('IN_PROGRESS'),
    text,
    toastType: 'BANNER',
  });
}

// function dismissAccountLinkBanner(providerID: ID) {
//   return dismissToast(`PROVIDERS/${providerID}`);
// }

function containsLinking(container: AccountLinkContainer): bool {
  for (const id in container) {
    if (container.hasOwnProperty(id) && isLinking(container[id])) {
      return true;
    }
  }
  return false;
}

function isShowingProviderLoginScreen(state: ReduxState): bool {
  const { modalQueue } = state.modalState;
  return modalQueue.length > 0 && modalQueue[0].id === PROVIDER_LOGIN_MODAL_ID;
}
