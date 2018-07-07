/* @flow */

import Transaction from 'common/lib/models/Transaction';

import { generateStateUtils } from './StateUtils';

import type { StateUtils as StateUtilsTemplate } from './StateUtils';
import type {
  TransactionCollection,
  TransactionRaw,
} from 'common/lib/models/Transaction';

// eslint-disable-next-line flowtype/generic-spacing
export type StateUtils = StateUtilsTemplate<
  'Transaction',
  TransactionRaw,
  Transaction,
  TransactionCollection,
>;

export default generateStateUtils(
  Transaction,
  reduxState => reduxState._transaction,
);
