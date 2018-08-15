/* @flow */

import Transaction from 'common/lib/models/Transaction';

import {
  generateActionCreators,
  generateCreateListener,
  generateCreateCursor,
  generateCreateOperation,
} from './Actions';

import type { Action as ActionTemplate } from './Actions';
import type { ModelCursor, ModelListener, ModelOperation } from '../types';
import type {
  ModelCollectionQuery,
  ModelOrderedCollectionQuery,
} from 'common/lib/models/Model';
import type {
  TransactionCollection,
  TransactionRaw,
} from 'common/lib/models/Transaction';

// eslint-disable-next-line flowtype/generic-spacing
export type Action = ActionTemplate<
  'Transaction',
  TransactionRaw,
  Transaction,
  TransactionCollection,
>;

type CreateCursor = (
  query: ModelOrderedCollectionQuery,
  pageSize: number,
) => ModelCursor<'Transaction'>;

type CreateListener = (
  query: ModelCollectionQuery,
) => ModelListener<'Transaction'>;

type CreateOperation = (
  query: ModelCollectionQuery,
) => ModelOperation<'Transaction'>;

// $FlowFixMe - Template types are correct.
export const createCursor: CreateCursor = generateCreateCursor(Transaction);
// $FlowFixMe - Template types are correct.
export const createListener: CreateListener = generateCreateListener(
  Transaction,
);
// $FlowFixMe - Template types are correct.
export const createOperation: CreateOperation = generateCreateOperation(
  Transaction,
);

export default generateActionCreators(Transaction);
