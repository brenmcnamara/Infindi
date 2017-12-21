/* @flow */

import Common from 'common';
import PlaidLink from '../modules/PlaidLink';

import invariant from 'invariant';

import {
  genCreatePlaidCredentials,
  genCreatePlaidDownloadRequest,
  genPlaidDownloadStatus,
} from '../backend';

import type { Next, PureAction, Store } from '../typesDEPRECATED/redux';
import type { PlaidLinkPayload } from '../modules/PlaidLink';

export type Action =
  | Action$PlaidHasDownloadRequests
  | Action$PlaidLinkAvailability
  | Action$PlaidLinkSuccess;

export type Action$PlaidHasDownloadRequests = {|
  +hasDownloadRequests: bool,
  +type: 'PLAID_HAS_DOWNLOAD_REQUESTS',
|};

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
        PlaidLink.show(async (payload: PlaidLinkPayload) => {
          invariant(
            isLinkShowing,
            'Completed PlaidLink but link is marked as not showing',
          );
          await onLinkComplete(next, payload);
          isLinkShowing = false;
        });
        break;
      }
    }
  };
};

async function onLinkComplete(next: Next, payload: PlaidLinkPayload) {
  PlaidLink.hide();
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

      const credentialsRef = await genCreatePlaidCredentials(
        publicToken,
        metadata,
      );

      next({
        hasDownloadRequests: true,
        type: 'PLAID_HAS_DOWNLOAD_REQUESTS',
      });
      await genCreatePlaidDownloadRequest(credentialsRef.refID);
      break;
    }
  }
}

function listenToDownloadStatus(store: Store, next: Next): EmitterSubscription {
  const interval = setInterval(() => {
    genUpdateDownloadStatus(store, next);
    // TODO: Should be able to get pushed updates from backend.
  }, 2000);

  return {
    remove: () => clearInterval(interval),
  };
}

async function genUpdateDownloadStatus(
  store: Store,
  next: Next,
): Promise<void> {
  let statusList;
  try {
    statusList = await genPlaidDownloadStatus();
  } catch (error) {
    // If we hit an error, just quit. The download status is not so critical
    // that we need to alert the user or terminate the app over it failing.
    // TODO: Should log this failure in DEV mode.
    return;
  }
  // TODO: "some" operation from obj-utils.
  const prevHasDownloadRequests = store.getState().plaid.hasDownloadRequests;
  const hasDownloadRequests = Common.ObjUtils.reduceObject(
    statusList,
    (memo, status) => memo || status.type !== 'COMPLETE',
    false,
  );
  if (hasDownloadRequests !== prevHasDownloadRequests) {
    next({
      hasDownloadRequests,
      type: 'PLAID_HAS_DOWNLOAD_REQUESTS',
    });
  }
}
