/* @flow */

import PlaidLink from '../modules/PlaidLink';

import invariant from 'invariant';

import { genCreatePlaidCredentials } from '../backend';

import type { Next, PureAction, Store } from '../typesDEPRECATED/redux';
import type { PlaidLinkPayload } from '../modules/PlaidLink';

export type Action = Action$PlaidLinkAvailability | Action$PlaidLinkSuccess;

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
      console.log('SUCCESSFULL LINKED', publicToken);
      // NOTE: We are not awaiting here because there are commands below we
      // do not want to block.

      const credentials = await genCreatePlaidCredentials(
        publicToken,
        metadata,
      );
      console.log('SUCCESSFULLY GENERATED CREDENTIALS', credentials);
      break;
    }
  }
}
