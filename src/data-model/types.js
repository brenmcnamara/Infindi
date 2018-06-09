/* @flow */

import type AccountLink, {
  AccountLinkRaw,
} from 'common/lib/models/AccountLink';
import type Account, { AccountRaw } from 'common/lib/models/Account';
import type Provider from 'common/lib/models/Provider';
import type Transaction, {
  TransactionRaw,
} from 'common/lib/models/Transaction';
import type UserInfo, { UserInfoRaw } from 'common/lib/models/UserInfo';

import type { ID } from 'common/types/core';
import type { ModelContainer } from '../datastore';

export type AccountContainer = ModelContainer<'Account', AccountRaw, Account>;
// eslint-disable-next-line flowtype/generic-spacing
export type AccountLinkContainer = ModelContainer<
  'AccountLink',
  AccountLinkRaw,
  AccountLink,
>;
export type LoadStatus = 'STEADY' | 'FAILURE' | 'LOADING' | 'EMPTY';
export type ProviderContainer = { [providerID: ID]: Provider };
export type ProviderFetchStatus = 'EMPTY' | 'LOADING' | 'STEADY' | 'FAILURE';
// eslint-disable-next-line flowtype/generic-spacing
export type TransactionContainer = ModelContainer<
  'Transaction',
  TransactionRaw,
  Transaction,
>;
export type TransactionLoadingStatus =
  | 'EMPTY'
  | 'LOADING'
  | 'STEADY'
  | 'END_OF_INPUT'
  | 'FAILURE';
// eslint-disable-next-line flowtype/generic-spacing
export type UserInfoContainer = ModelContainer<
  'UserInfo',
  UserInfoRaw,
  UserInfo,
>;
