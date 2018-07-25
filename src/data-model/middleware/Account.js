/* @flow */

import Account from 'common/lib/models/Account';
import Middleware from './Middleware';

import type { AccountCollection, AccountRaw } from 'common/lib/models/Account';

export default class AccountMiddleware extends Middleware<
  'Account',
  AccountRaw,
  Account,
  AccountCollection,
> {
  static __ModelCtor = Account;
}
