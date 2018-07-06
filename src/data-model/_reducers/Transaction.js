/* @flow */

import Transaction from 'common/lib/models/Transaction';

import { generateReducer } from './Reducer';

import type { State as StateTemplate } from './Reducer';
import type { TransactionRaw } from 'common/lib/models/Transaction';

export type State = StateTemplate<'Transaction', TransactionRaw, Transaction>;

export default generateReducer(Transaction);
