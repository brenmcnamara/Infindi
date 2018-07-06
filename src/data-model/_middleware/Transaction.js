/* @flow */

import Middleware from './Middleware';
import Transaction from 'common/lib/models/Transaction';

import type {
  TransactionCollection,
  TransactionRaw,
} from 'common/lib/models/Transaction';

export default class TransactionMiddleware extends Middleware<
  'Transaction',
  TransactionRaw,
  Transaction,
  TransactionCollection,
> {
  static __ModelCtor = Transaction;
}
