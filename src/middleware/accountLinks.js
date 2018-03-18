/* @flow */

import invariant from 'invariant';
import uuid from 'uuid/v4';

import { didLogin, willLogout } from '../common/action-utils';
// eslint-disable-next-line max-len
import { getAccountLinkCollection } from 'common/lib/models/AccountLink';

import type { AccountLink } from 'common/lib/models/AccountLink';
import type { EmitterSubscription } from '../common/event-utils';
import type { LoginPayload } from 'common/lib/models/Auth';
import type { ModelContainer } from '../datastore';
import type { PureAction, Next, Store } from '../typesDEPRECATED/redux';

type AccountLinkContainer = ModelContainer<'AccountLink', AccountLink>;

export default (store: Store) => (next: Next) => {
  let accountLinkSubscription: ?EmitterSubscription = null;

  return (action: PureAction) => {
    next(action);

    if (didLogin(action)) {
      const loginPayload = extractLoginPayload(action);
      accountLinkSubscription && accountLinkSubscription.remove();
      accountLinkSubscription = listenForAccountLink(store, loginPayload, next);
    } else if (willLogout(action)) {
      accountLinkSubscription && accountLinkSubscription.remove();
      accountLinkSubscription = null;
      clearUserData(next);
    }
  };
};

function listenForAccountLink(
  store: Store,
  loginPayload: LoginPayload,
  next: Next,
): EmitterSubscription {
  let operationID = uuid();
  next({
    modelName: 'AccountLink',
    operationID,
    type: 'CONTAINER_DOWNLOAD_START',
  });
  const userID = loginPayload.firebaseUser.uid;
  const remove = getAccountLinkCollection()
    .where('userRef.refID', '==', userID)
    .onSnapshot(snapshot => {
      const container: AccountLinkContainer = {};
      snapshot.docs.forEach(doc => {
        if (!doc.exists) {
          return;
        }
        const accountLink: AccountLink = doc.data();
        container[accountLink.id] = accountLink;
      });

      // Update the refresh info container.
      next({
        container,
        modelName: 'AccountLink',
        operationID,
        type: 'CONTAINER_DOWNLOAD_FINISHED',
        updateStrategy: 'REPLACE_CURRENT_CONTAINER',
      });
      operationID = uuid();
    });
  return { remove };
}

function clearUserData(next: Next): void {
  next({
    modelName: 'AccountLink',
    operationID: uuid(),
    type: 'CONTAINER_CLEAR',
  });
}

function extractLoginPayload(action: PureAction): LoginPayload {
  invariant(
    action.type === 'AUTH_STATUS_CHANGE' && action.status.type === 'LOGGED_IN',
    'Expected action to be AUTH_STATUS_CHANGE with LOGGED_IN status type',
  );
  return action.status.loginPayload;
}
