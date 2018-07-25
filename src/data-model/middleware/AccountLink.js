/* @flow */

import AccountLink from 'common/lib/models/AccountLink';
import Middleware from './Middleware';

import type {
  AccountLinkCollection,
  AccountLinkRaw,
} from 'common/lib/models/AccountLink';

export default class AccountLinkMiddleware extends Middleware<
  'AccountLink',
  AccountLinkRaw,
  AccountLink,
  AccountLinkCollection,
> {
  static __ModelCtor = AccountLink;
}
