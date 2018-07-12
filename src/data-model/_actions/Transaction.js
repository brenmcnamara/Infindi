/* @flow */

import Transaction from 'common/lib/models/Transaction';

import {
  generateActionCreators,
  generateCreateListener,
  generateCreateCursor,
} from './Actions';

import type { Action as ActionTemplate } from './Actions';
import type { ModelCursor, ModelListener } from '../_types';
import type { ModelOrderedQuery, ModelQuery } from 'common/lib/models/Model';
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
  query: ModelOrderedQuery,
  pageSize: number,
) => ModelCursor<'Transaction'>;
type CreateListener = (query: ModelQuery) => ModelListener<'Transaction'>;

// $FlowFixMe - Template types are correct.
export const createCursor: CreateCursor = generateCreateCursor(Transaction);
// $FlowFixMe - Template types are correct.
export const createListener: CreateListener = generateCreateListener(
  Transaction,
);

export default generateActionCreators(Transaction);
