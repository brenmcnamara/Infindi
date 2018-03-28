/* @flow */

import invariant from 'invariant';
import uuid from 'uuid/v4';

import { didLogin, willLogout } from '../common/action-utils';
import { getAccountCollection } from 'common/lib/models/Account';

import type { Account } from 'common/lib/models/Account';
import type { EmitterSubscription } from '../common/event-utils';
import type { LoginPayload } from 'common/lib/models/Auth';
import type { ModelContainer } from '../datastore';
import type { PureAction, Next, Store } from '../typesDEPRECATED/redux';

export default (store: Store) => (next: Next) => {
  let accountSubscription: ?EmitterSubscription = null;

  return (action: PureAction) => {
    next(action);

    if (didLogin(action)) {
      const loginPayload = extractLoginPayload(action);
      accountSubscription && accountSubscription.remove();
      accountSubscription = listenForAccounts(loginPayload, next);
    } else if (willLogout(action)) {
      accountSubscription && accountSubscription.remove();
      accountSubscription = null;
      clearUserData(next);
    }
  };
};

function listenForAccounts(
  loginPayload: LoginPayload,
  next: Next,
): EmitterSubscription {
  let operationID = uuid();
  next({ modelName: 'Account', operationID, type: 'CONTAINER_DOWNLOAD_START' });
  const userID = loginPayload.firebaseUser.uid;
  const remove = getAccountCollection()
    .where('canDisplay', '==', true)
    .where('sourceOfTruth.type', '==', 'YODLEE')
    .where('userRef.refID', '==', userID)
    .onSnapshot(snapshot => {
      const container: ModelContainer<*, Account> = {};
      snapshot.docs.forEach(doc => {
        if (!doc.exists) {
          return;
        }
        const account: Account = doc.data();
        container[account.id] = account;
      });
      next({
        container,
        modelName: 'Account',
        operationID,
        type: 'CONTAINER_DOWNLOAD_FINISHED',
        updateStrategy: 'REPLACE_CURRENT_CONTAINER',
      });
    });
  return { remove };
}

function clearUserData(next: Next): void {
  next({ modelName: 'Account', operationID: uuid(), type: 'CONTAINER_CLEAR' });
}

function extractLoginPayload(action: PureAction): LoginPayload {
  invariant(
    action.type === 'AUTH_STATUS_CHANGE' && action.status.type === 'LOGGED_IN',
    'Expected action to be AUTH_STATUS_CHANGE with LOGGED_IN status type',
  );
  return action.status.loginPayload;
}
