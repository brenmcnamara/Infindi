/* @flow */

import uuid from 'uuid/v4';

import { getAccountCollection } from 'common/lib/models/Account';
import { getActiveUserID } from '../common/state-utils';

import type { Account } from 'common/lib/models/Account';
import type { EmitterSubscription } from '../common/event-utils';
import type { ID } from 'common/types/core';
import type { ModelContainer } from '../datastore';
import type { PureAction, Next, Store } from '../typesDEPRECATED/redux';

type AccountContainer = ModelContainer<'Account', Account>;

export default (store: Store) => (next: Next) => {
  let accountSubscription: ?EmitterSubscription = null;
  let isInitialLoad = true;
  let activeUserID: ID | null = null;

  return (action: PureAction) => {
    next(action);

    const postActionState = store.getState();

    const nextActiveUserID = getActiveUserID(postActionState);
    const didChangeActiveUser = activeUserID !== nextActiveUserID;

    if (!didChangeActiveUser) {
      return;
    }

    accountSubscription && accountSubscription.remove();
    accountSubscription = null;
    if (!isInitialLoad) {
      clearUserData(next);
    }

    if (nextActiveUserID) {
      accountSubscription = listenForAccounts(nextActiveUserID, next);
    }

    activeUserID = nextActiveUserID;
    isInitialLoad = false;
  };
};

function listenForAccounts(
  userID: ID,
  next: Next,
): EmitterSubscription {
  let operationID = uuid();
  next({ modelName: 'Account', operationID, type: 'CONTAINER_DOWNLOAD_START' });
  const remove = getAccountCollection()
    .where('canDisplay', '==', true)
    .where('sourceOfTruth.type', '==', 'YODLEE')
    .where('userRef.refID', '==', userID)
    .onSnapshot(snapshot => {
      const container: AccountContainer = {};
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
      operationID = uuid();
    });
  return { remove };
}

function clearUserData(next: Next): void {
  next({ modelName: 'Account', operationID: uuid(), type: 'CONTAINER_CLEAR' });
}
