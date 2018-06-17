/* @flow */

import Firebase from 'react-native-firebase';

import type { ID } from 'common/types/core';
import type { PureAction, Next, StoreType } from '../../store';
import type { UserInfoRaw } from 'common/lib/models/UserInfo';

export default (store: StoreType) => (next: Next) => {
  return (action: PureAction) => {
    next(action);

    switch (action.type) {
      case 'FETCH_ALL_USERS_INITIALIZE': {
        genFetchAllUsers(next, action.operationID);
        break;
      }
    }
  };
};

async function genFetchAllUsers(next: Next, operationID: ID): Promise<void> {
  // TODO: Create a larger error boundary. Maybe abstract error boundary in a
  // separate method.
  let snapshot;
  try {
    // $FlowFixMe - This is correct.
    snapshot = await Firebase.firestore()
      .collection('UserInfo')
      .get();
  } catch (error) {
    next({
      error,
      operationID,
      type: 'FETCH_ALL_USERS_FAILURE',
    });
    return;
  }

  const container = {};
  snapshot.docs.forEach(doc => {
    if (doc.exists) {
      const userInfo: UserInfoRaw = doc.data();
      container[userInfo.id] = userInfo;
    }
  });
  next({
    container,
    operationID,
    type: 'FETCH_ALL_USERS_SUCCESS',
  });
}
