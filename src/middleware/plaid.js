/* @flow */

import Common from 'common';
import PlaidLink from '../modules/PlaidLink';

import invariant from 'invariant';

import { dismissToast, requestToast } from '../actions/toast';
import {
  genCreatePlaidCredentials,
  genCreatePlaidDownloadRequest,
  genPlaidDownloadStatus,
} from '../backend';
import { handleNetworkRequest } from '../common/middleware-utils';

import type { Next, PureAction, Store } from '../typesDEPRECATED/redux';
import type { PlaidLinkPayload } from '../modules/PlaidLink';

export type Action = Action$PlaidLinkAvailability | Action$PlaidLinkStatus;

export type Action$PlaidLinkAvailability = {|
  +isAvailable: bool,
  +type: 'PLAID_LINK_AVAILABILITY',
|};

export type Action$PlaidLinkStatus = {|
  +status: 'SHOWING' | 'HIDING',
  +type: 'PLAID_LINK_STATUS',
|};

type EmitterSubscription = { remove: () => void };

export default (store: Store) => (next: Next) => {
  let downloadStatusSubscription: ?EmitterSubscription = null;
  let isLinkShowing: bool = false;

  PlaidLink.genIsAvailable().then(isAvailable => {
    next({
      isAvailable,
      type: 'PLAID_LINK_AVAILABILITY',
    });
  });

  return (action: PureAction) => {
    next(action);
    switch (action.type) {
      case 'AUTH_STATUS_CHANGE': {
        if (action.status.type === 'LOGGED_IN') {
          if (downloadStatusSubscription) {
            downloadStatusSubscription.remove();
            downloadStatusSubscription = null;
          }
          downloadStatusSubscription = listenToDownloadStatus(store, next);
        } else if (action.status.type === 'LOGGED_OUT') {
          if (downloadStatusSubscription) {
            downloadStatusSubscription.remove();
            downloadStatusSubscription = null;
          }
        }
        break;
      }

      case 'PLAID_LINK_ACCOUNT': {
        invariant(
          !isLinkShowing,
          'Cannot try to link account PlaidLink is showing',
        );
        isLinkShowing = true;
        next({
          modal: {
            hide: () => PlaidLink.hide(),
            id: 'PLAID_LINK',
            modalType: 'NATIVE',
            priority: 'USER_REQUESTED',
            show: () =>
              PlaidLink.show(async (payload: PlaidLinkPayload) => {
                invariant(
                  isLinkShowing,
                  'Completed PlaidLink but link is marked as not showing',
                );
                await onLinkComplete(store, next, payload);
                isLinkShowing = false;
              }),
          },
          type: 'REQUEST_MODAL',
        });

        break;
      }
    }
  };
};

async function onLinkComplete(
  store: Store,
  next: Next,
  payload: PlaidLinkPayload,
) {
  next({
    modalID: 'PLAID_LINK',
    type: 'DISMISS_MODAL',
  });
  switch (payload.type) {
    case 'LINK_QUIT': {
      break;
    }

    case 'LINK_FAILURE': {
      // TODO: Need to show banner that plaid has failed with linking account.
      break;
    }

    case 'LINK_SUCCESS': {
      // Send download to backend.
      const { metadata, publicToken } = payload;
      // NOTE: We are not awaiting here because there are commands below we
      // do not want to block.

      const credentialsRef = await handleNetworkRequest(
        store,
        next,
        'plaid.credentials.create',
        () => genCreatePlaidCredentials(publicToken, metadata),
      );

      next(
        requestToast({
          bannerChannel: 'ACCOUNTS',
          bannerType: 'INFO',
          id: 'ACCOUNTS_UPDATING',
          priority: 'NORMAL',
          text: 'You have updating accounts...',
          toastType: 'BANNER',
        }),
      );
      await handleNetworkRequest(
        store,
        next,
        'plaid.downloadRequest.create',
        () => genCreatePlaidDownloadRequest(credentialsRef.refID),
      );
      break;
    }
  }
}

function listenToDownloadStatus(store: Store, next: Next): EmitterSubscription {
  let hasDownloadRequests = false;
  const interval = setInterval(async () => {
    // TODO: Should be able to get pushed updates from backend. Make sure pushed
    // updates automatically activate and de-activate when internet connection
    // goes in and out.
    hasDownloadRequests = await genUpdateDownloadStatus(
      hasDownloadRequests,
      store,
      next,
    );
  }, 2000);

  return {
    remove: () => clearInterval(interval),
  };
}

async function genUpdateDownloadStatus(
  prevHasDownloadRequests: bool,
  store: Store,
  next: Next,
): Promise<bool> {
  let statusList;
  try {
    statusList = await handleNetworkRequest(
      store,
      next,
      'plaid.downloadStatus.get',
      () => genPlaidDownloadStatus(),
    );
  } catch (error) {
    // If we hit an error, just quit. The download status is not so critical
    // that we need to alert the user or terminate the app over it failing.
    return false;
  }
  // TODO: "some" operation from obj-utils.
  const hasDownloadRequests = Common.ObjUtils.reduceObject(
    statusList,
    (memo, status) => memo || status.type !== 'COMPLETE',
    false,
  );
  if (hasDownloadRequests === prevHasDownloadRequests) {
    return hasDownloadRequests;
  }
  if (hasDownloadRequests) {
    next(
      requestToast({
        bannerChannel: 'ACCOUNTS',
        bannerType: 'INFO',
        id: 'ACCOUNTS_UPDATING',
        priority: 'NORMAL',
        text: 'You have updating accounts...',
        toastType: 'BANNER',
      }),
    );
  } else {
    next(dismissToast('ACCOUNTS_UPDATING'));
  }
  return hasDownloadRequests;
}
