/* @flow */

import Account from 'common/lib/models/Account';

import {
  generateActionCreators,
  generateCreateCursor,
  generateCreateListener,
} from './Actions';

import type { AccountCollection, AccountRaw } from 'common/lib/models/Account';
import type { Action as ActionTemplate } from './Actions';
import type { ModelCursor, ModelListener } from '../_types';
import type { ModelOrderedQuery, ModelQuery } from 'common/lib/models/Model';

// eslint-disable-next-line flowtype/generic-spacing
export type Action = ActionTemplate<
  'Account',
  AccountRaw,
  Account,
  AccountCollection,
>;

type CreateCursor = (
  query: ModelOrderedQuery,
  pageSize: number,
) => ModelCursor<'Account'>;
type CreateListener = (query: ModelQuery) => ModelListener<'Account'>;

// $FlowFixMe - Template types are correct.
export const createCursor: CreateCursor = generateCreateCursor(Account);
// $FlowFixMe - Template types are correct.
export const createListener: CreateListener = generateCreateListener(Account);

export default generateActionCreators(Account);
