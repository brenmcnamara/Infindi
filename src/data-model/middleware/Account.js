/* @flow */

import Account from 'common/lib/models/Account';
import AccountFetcher from 'common/lib/models/AccountFetcher';
import AccountMutator from 'common/lib/models/AccountMutator';
import Middleware from './Middleware';

import type {
  AccountCollection,
  AccountOrderedCollection,
  AccountRaw,
} from 'common/lib/models/Account';

export default class AccountMiddleware extends Middleware<
  'Account',
  AccountRaw,
  Account,
  AccountCollection,
  AccountOrderedCollection,
  typeof AccountFetcher,
  typeof AccountMutator,
> {
  static __ModelCtor = Account;
  static __ModelFetcher = AccountFetcher;
  static __ModelMutator = AccountMutator;
}
