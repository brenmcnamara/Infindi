/* @flow */

import uuid from 'uuid/v4';

import { getAccountLinkCollection } from 'common/lib/models/AccountLink';
import { getActiveUserID } from '../common/state-utils';

import type { AccountLink } from 'common/lib/models/AccountLink';
import type { EmitterSubscription } from '../common/event-utils';
import type { ID } from 'common/types/core';
import type { ModelContainer } from '../datastore';
import type { PureAction, Next, Store } from '../store';

type AccountLinkContainer = ModelContainer<'AccountLink', AccountLink>;

export default (store: Store) => (next: Next) => {
  let isInitialLoad = true;
  let accountLinkSubscription: ?EmitterSubscription = null;
  let activeUserID: ID | null;

  return (action: PureAction) => {
    next(action);

    const postActionState = store.getState();
    const nextActiveUserID = getActiveUserID(postActionState);
    const didChangeActiveUser = activeUserID !== nextActiveUserID;

    if (!didChangeActiveUser) {
      return;
    }

    accountLinkSubscription && accountLinkSubscription.remove();
    accountLinkSubscription = null;
    if (!isInitialLoad) {
      clearUserData(next);
    }

    if (nextActiveUserID) {
      accountLinkSubscription = listenForAccountLink(nextActiveUserID, next);
    }

    activeUserID = nextActiveUserID;
    isInitialLoad = true;
  };
};

function listenForAccountLink(userID: ID, next: Next): EmitterSubscription {
  let operationID = uuid();
  next({
    modelName: 'AccountLink',
    operationID,
    type: 'CONTAINER_DOWNLOAD_START',
  });
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
