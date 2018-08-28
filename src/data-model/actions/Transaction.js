/* @flow */

import Transaction from 'common/lib/models/Transaction';

import { generateActionCreators } from './Actions';

import type { Action as ActionTemplate } from './Actions';
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

export default generateActionCreators(Transaction);
