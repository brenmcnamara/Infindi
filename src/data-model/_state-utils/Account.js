/* @flow */

import Account from 'common/lib/models/Account';

import { generateStateUtils } from './StateUtils';

import type {
  AccountCollection,
  AccountOrderedCollection,
  AccountRaw,
} from 'common/lib/models/Account';
import type { StateUtils as StateUtilsTemplate } from './StateUtils';

// eslint-disable-next-line flowtype/generic-spacing
export type StateUtils = StateUtilsTemplate<
  'Account',
  AccountRaw,
  Account,
  AccountCollection,
  AccountOrderedCollection,
>;

export default generateStateUtils(Account, reduxState => reduxState.account);
