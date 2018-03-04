/* @flow */

import {
  AccountsDownloadingBanner,
  ProviderLoginBanner,
} from '../../../content';
import { dismissToast, requestToast } from '../../actions/toast';
import {
  isLinkFailure,
  isLinking,
  isLinkSuccess,
} from 'common/lib/models/AccountLink';
import { forEachObject } from '../../common/obj-utils';

import type { AccountLink } from 'common/lib/models/AccountLink';
import type { ID } from 'common/types/core';
import type { ModelCollection } from '../../datastore';
import type { PureAction, Next, Store } from '../../typesDEPRECATED/redux';

type ProviderBannerStatus =
  | {| +type: 'INITIALIZING' | 'LINKING' | 'SUCCESS' |}
  | {| +error?: Error, +type: 'FAILURE' |};

type AccountLinkCollection = ModelCollection<'AccountLink', AccountLink>;

const REFRESH_ACCOUNTS_DOWNLOADING_TOAST_ID = 'YODLEE_ACCOUNTS_DOWNLOADING';
const FAILURE_BANNER_PROVIDER_LOGIN_DURATION_MILLIS = 3000;

export default (store: Store) => (next: Next) => {
  const providerBannerStatusMap: { [id: ID]: ProviderBannerStatus } = {};
  let isAccountsDownloadingBanner = false;
  let failureBannerProviderLoginTimeoutID = null;

  function updateBannerStatus(
    providerID: ID,
    nextBannerStatus: ProviderBannerStatus | null,
  ): void {
    const prevBannerStatus = providerBannerStatusMap[providerID] || null;

    const prevStatusType = prevBannerStatus && prevBannerStatus.type;
    const nextStatusType = nextBannerStatus && nextBannerStatus.type;
    if (prevStatusType === nextStatusType) {
      return;
    }

    if (!nextBannerStatus || prevBannerStatus) {
      next(dismissProviderBanner(providerID));
    }

    if (nextBannerStatus) {
      const bannerText =
        nextBannerStatus.type === 'FAILURE' &&
        nextBannerStatus.error &&
        nextBannerStatus.error.errorMessage
          ? // $FlowFixMe - Add stricter error typing
            (nextBannerStatus.error.errorMessage: string)
          : ProviderLoginBanner[nextBannerStatus.type];
      next(requestProviderBanner(providerID, nextBannerStatus, bannerText));
    }

    if (nextBannerStatus) {
      providerBannerStatusMap[providerID] = nextBannerStatus;
    } else {
      delete providerBannerStatusMap[providerID];
    }
    if (failureBannerProviderLoginTimeoutID) {
      clearTimeout(failureBannerProviderLoginTimeoutID);
    }
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
          const nextBannerStatus = getBannerStatus(accountLink);
          updateBannerStatus(providerID, nextBannerStatus);
        });

        const shouldShowAccountsDownloadingBanner = containsPendingRefresh(
          collection,
        );
        updateAccountsDownloading(shouldShowAccountsDownloadingBanner);
        break;
      }

      case 'REQUEST_PROVIDER_LOGIN': {
        // NOTE: There is an edge case we are not properly handling here. If
        // a providder sends a long request, we get the banner to show that
        // accounts are downloading. It could be the case that right after this
        // request is sent, before the refresh info for the provider is created
        // we have a refresh of the user's providers that won't include a new
        // refresh for this provider. If none of the refreshes show downloading
        // accounts, then the banner will get dismissed too early. This is
        // probably a very rare (1 in a million) edge case and the bug is
        // so minor that it is not writing all the round-about logic to correct
        // for this.
        const providerID = action.provider.id;
        updateAccountsDownloading(true);
        updateBannerStatus(providerID, { type: 'INITIALIZING' });
        break;
      }

      case 'REQUEST_PROVIDER_LOGIN_FAILED': {
        const providerID = action.provider.id;
        const { error } = action;
        updateAccountsDownloading(false);
        updateBannerStatus(providerID, { error, type: 'FAILURE' });
        failureBannerProviderLoginTimeoutID = setTimeout(() => {
          updateBannerStatus(providerID, null);
        }, FAILURE_BANNER_PROVIDER_LOGIN_DURATION_MILLIS);
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
    text: AccountsDownloadingBanner,
    toastType: 'BANNER',
  });
}

function dismissAccountsDownloadingBanner() {
  return dismissToast(REFRESH_ACCOUNTS_DOWNLOADING_TOAST_ID);
}

function requestProviderBanner(
  providerID: ID,
  status: ProviderBannerStatus,
  text: string,
) {
  const id = `PROVIDERS/${providerID}`;
  return requestToast({
    bannerChannel: id,
    bannerType:
      status.type === 'FAILURE'
        ? 'ERROR'
        : status.type === 'SUCCESS' ? 'SUCCESS' : 'INFO',
    id,
    priority: 'LOW',
    text,
    toastType: 'BANNER',
  });
}

function dismissProviderBanner(providerID: ID) {
  return dismissToast(`PROVIDERS/${providerID}`);
}

function getBannerStatus(
  accountLink: AccountLink,
): ProviderBannerStatus | null {
  if (isLinking(accountLink)) {
    return { type: 'LINKING' };
  }

  if (isLinkSuccess(accountLink)) {
    return { type: 'SUCCESS' };
  }

  if (isLinkFailure(accountLink)) {
    return { type: 'FAILURE' };
  }

  return null;
}

function containsPendingRefresh(collection: AccountLinkCollection): bool {
  for (const id in collection) {
    if (collection.hasOwnProperty(id) && isLinking(collection[id])) {
      return true;
    }
  }
  return false;
}