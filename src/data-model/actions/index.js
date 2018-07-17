/* @flow */

import { clearAllUsers, fetchAllUsers } from './userInfo';

import type { Action as Action$Providers } from './providers';
import type { Action as Action$UserInfo } from './userInfo';

export type Action = Action$Providers | Action$UserInfo;

export default {
  clearAllUsers,
  fetchAllUsers,
};
