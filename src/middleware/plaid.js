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

export default (store: Store) => (next: Next) => {
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
          genOnUserLoggedIn(next);
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

async function genOnUserLoggedIn(next: Next) {
  // TODO: May want to poll for this data at some point. Not worried about
  // doing this now, since it is unlikely that someone would have multiple
  // clients they are using.
  const statusList = await genPlaidDownloadStatus();
  // "some" operation from obj-utils.
  const hasDownloadRequests = Common.ObjUtils.reduceObject(
    statusList,
    (memo, status) => memo || status.type !== 'COMPLETE',
    false,
  );
  console.log(statusList, hasDownloadRequests);
  next({
    hasDownloadRequests,
    type: 'PLAID_HAS_DOWNLOAD_REQUESTS',
  });
}

async function onLinkComplete(next: Next, payload: PlaidLinkPayload) {
  PlaidLink.hide();
  switch (payload.type) {
    case 'LINK_QUIT': {
      console.log('QUIT!');
      break;
    }

    case 'LINK_FAILURE': {
      // TODO: What should we do during failure? Do we tell the user? Do we
      // just pretend everything went okay?
      console.log('FAILURE');
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
      console.log('SUCCESSFULLY GENERATED CREDENTIALS', credentialsRef);
      genCreatePlaidDownloadRequest(credentialsRef.refID);
      break;
    }
  }
}
