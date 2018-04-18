/* @flow */

import uuid from 'uuid/v4';

import type { ID } from 'common/types/core';
import type { UserInfoContainer } from '../types';

export type Action =
  | Action$ClearAllUsers
  | Action$FetchAllUsersFailure
  | Action$FetchAllUsersInitialize
  | Action$FetchAllUsersSuccess;

type Action$FetchAllUsersFailure = {|
  +error: Object,
  +operationID: ID,
  +type: 'FETCH_ALL_USERS_FAILURE',
|};

type Action$FetchAllUsersInitialize = {|
  +operationID: ID,
  +type: 'FETCH_ALL_USERS_INITIALIZE',
|};

type Action$FetchAllUsersSuccess = {|
  +container: UserInfoContainer,
  +operationID: ID,
  +type: 'FETCH_ALL_USERS_SUCCESS',
|};

export function fetchAllUsers() {
  return {
    operationID: uuid(),
    type: 'FETCH_ALL_USERS_INITIALIZE',
  };
}

type Action$ClearAllUsers = {|
  +type: 'CLEAR_ALL_USERS',
|};

export function clearAllUsers() {
  return {
    type: 'CLEAR_ALL_USERS',
  };
}
