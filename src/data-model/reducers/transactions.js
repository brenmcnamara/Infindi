/* @flow */

import { createModelContainerReducer } from '../../datastore';

import type { ModelContainer, ModelState } from '../../datastore';
import type { Transaction } from 'common/lib/models/Transaction';

export type AccountContainer = ModelContainer<'Transaction', Transaction>;

export type State = ModelState<'Transaction', Transaction>;

const transactions: (state: State, action: *) => * = createModelContainerReducer(
  'Transaction',
);

export default transactions;
