/* @flow */

import Transaction from 'common/lib/models/Transaction';

import { generateReducer } from './Reducer';

import type { State as StateTemplate } from './Reducer';
import type {
  TransactionCollection,
  TransactionRaw,
} from 'common/lib/models/Transaction';

// eslint-disable-next-line flowtype/generic-spacing
export type State = StateTemplate<
  'Transaction',
  TransactionRaw,
  Transaction,
  TransactionCollection,
>;

export default generateReducer(Transaction);
