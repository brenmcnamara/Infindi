/* @flow */

import Account from 'common/lib/models/Account';

import {
  generateActionCreators,
  generateCreateCursor,
  generateCreateListener,
  generateCreateOperation,
} from './Actions';

import type { AccountCollection, AccountRaw } from 'common/lib/models/Account';
import type { Action as ActionTemplate } from './Actions';
import type { ModelCursor, ModelListener, ModelOperation } from '../_types';
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

type CreateOperation = (query: ModelQuery) => ModelOperation<'Account'>;

// $FlowFixMe - Template types are correct.
export const createCursor: CreateCursor = generateCreateCursor(Account);
// $FlowFixMe - Template types are correct.
export const createListener: CreateListener = generateCreateListener(Account);
// $FlowFixMe - Template types are correct.
export const createOperation: CreateOperation = generateCreateOperation(
  Account,
);

export default generateActionCreators(Account);
