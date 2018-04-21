/* @flow */

import { clearAllUsers, fetchAllUsers } from './userInfo';
import { fetchTransactions } from './transactions';

import type { Action as Action$Providers } from './providers';
import type { Action as Action$Transactions } from './transactions';
import type { Action as Action$UserInfo } from './userInfo';

export type Action = Action$Providers | Action$Transactions | Action$UserInfo;

export default {
  clearAllUsers,
  fetchAllUsers,
  fetchTransactions,
};
