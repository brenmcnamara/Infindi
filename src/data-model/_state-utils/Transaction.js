/* @flow */

import Transaction from 'common/lib/models/Transaction';

import { generateStateUtils } from './StateUtils';

import type { StateUtils as StateUtilsTemplate } from './StateUtils';
import type {
  TransactionCollection,
  TransactionOrderedCollection,
  TransactionRaw,
} from 'common/lib/models/Transaction';

// eslint-disable-next-line flowtype/generic-spacing
export type StateUtils = StateUtilsTemplate<
  'Transaction',
  TransactionRaw,
  Transaction,
  TransactionCollection,
  TransactionOrderedCollection,
>;

export default generateStateUtils(
  Transaction,
  reduxState => reduxState.transaction,
);
