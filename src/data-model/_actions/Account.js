/* @flow */

import Account from 'common/lib/models/Account';

import {
  generateActionCreators,
  generateCreateCursor,
  generateCreateListener,
} from './Actions';

import type { AccountCollection, AccountRaw } from 'common/lib/models/Account';
import type { Action as ActionTemplate } from './Actions';
import type { ModelCursor, ModelListener, ModelQuery } from '../_types';

// eslint-disable-next-line flowtype/generic-spacing
export type Action = ActionTemplate<
  'Account',
  AccountRaw,
  Account,
  AccountCollection,
>;

type CreateListener = (query: ModelQuery) => ModelListener<'Account'>;
type CreateCursor = (query: ModelQuery) => ModelCursor<'Account'>;

// $FlowFixMe - Template types are correct.
export const createListener: CreateListener = generateCreateListener(Account);
// $FlowFixMe - Template types are correct.
export const createCursor: CreateCursor = generateCreateCursor(Account);

export default generateActionCreators(Account);
