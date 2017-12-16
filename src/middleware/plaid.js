/* @flow */

import PlaidLink from '../modules/PlaidLink';

import invariant from 'invariant';

import type { Next, PureAction, Store } from '../typesDEPRECATED/redux';
import type { PlaidLinkPayload } from '../modules/PlaidLink';

export type Action = Action$PlaidLinkSuccess;

export type Action$PlaidLinkStatus = {|
  +status: 'SHOWING' | 'HIDING',
  +type: 'PLAID_LINK_STATUS',
|};

export default (store: Store) => (next: Next) => {
  let isLinkShowing: bool = false;

  return (action: PureAction) => {
    next(action);
    switch (action.type) {
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
      console.log('SUCCESS', publicToken);
      // Start download request.
      break;
    }
  }
  PlaidLink.hide();
}
