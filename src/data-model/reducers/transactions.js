/* @flow */

import { createModelContainerReducer } from '../../datastore';

import type Transaction, {
  TransactionRaw,
} from 'common/lib/models/Transaction';

import type { ModelState } from '../../datastore';
import type { Reducer } from '../../store';

export type State = ModelState<'Transaction', TransactionRaw, Transaction>;

const transactions: Reducer<State> = createModelContainerReducer('Transaction');

export default transactions;
