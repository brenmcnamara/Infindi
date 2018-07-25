/* @flow */

import Account from 'common/lib/models/Account';

import { generateReducer } from './Reducer';

import type { AccountCollection, AccountRaw } from 'common/lib/models/Account';
import type { State as StateTemplate } from './Reducer';

// eslint-disable-next-line flowtype/generic-spacing
export type State = StateTemplate<
  'Account',
  AccountRaw,
  Account,
  AccountCollection,
>;

export default generateReducer(Account);
