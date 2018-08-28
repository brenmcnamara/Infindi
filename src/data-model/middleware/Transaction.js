/* @flow */

import Middleware from './Middleware';
import Transaction from 'common/lib/models/Transaction';
import TransactionFetcher from 'common/lib/models/TransactionFetcher';
import TransactionMutator from 'common/lib/models/TransactionMutator';

import type {
  TransactionCollection,
  TransactionOrderedCollection,
  TransactionRaw,
} from 'common/lib/models/Transaction';

export default class TransactionMiddleware extends Middleware<
  'Transaction',
  TransactionRaw,
  Transaction,
  TransactionCollection,
  TransactionOrderedCollection,
  typeof TransactionFetcher,
  typeof TransactionMutator,
> {
  static __ModelCtor = Transaction;
  static __ModelFetcher = TransactionFetcher;
  static __ModelMutator = TransactionMutator;
}
