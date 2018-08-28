/* @flow */

import AccountLink from 'common/lib/models/AccountLink';
import AccountLinkFetcher from 'common/lib/models/AccountLinkFetcher';
import AccountLinkMutator from 'common/lib/models/AccountLinkMutator';
import Middleware from './Middleware';

import type {
  AccountLinkCollection,
  AccountLinkOrderedCollection,
  AccountLinkRaw,
} from 'common/lib/models/AccountLink';

export default class AccountLinkMiddleware extends Middleware<
  'AccountLink',
  AccountLinkRaw,
  AccountLink,
  AccountLinkCollection,
  AccountLinkOrderedCollection,
  typeof AccountLinkFetcher,
  typeof AccountLinkMutator,
> {
  static __ModelCtor = AccountLink;
  static __ModelFetcher = AccountLinkFetcher;
  static __ModelMutator = AccountLinkMutator;
}
