/* @flow */

/* eslint-disable flowtype/generic-spacing */

import Transaction from 'common/lib/models/Transaction';

import { generateDataUtils } from './DataUtils';

import type { DataUtils } from './DataUtils';

const TransactionDataUtils: DataUtils<'Transaction'> = generateDataUtils(
  Transaction,
);

export default TransactionDataUtils;
