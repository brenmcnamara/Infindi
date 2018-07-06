/* @flow */

import Account from 'common/lib/models/Account';

import {
  generateActionCreators,
  generateCreateListener,
  generateCreatePageCursor,
} from './Actions';

import type { AccountCollection, AccountRaw } from 'common/lib/models/Account';
import type { Action as ActionTemplate } from './Actions';

// eslint-disable-next-line flowtype/generic-spacing
export type Action = ActionTemplate<
  'Account',
  AccountRaw,
  Account,
  AccountCollection,
>;

export const createListener = generateCreateListener(Account);
export const createPageCursor = generateCreatePageCursor(Account);

export default generateActionCreators(Account);
