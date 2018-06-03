/* @flow */

import type { AccountLink } from 'common/lib/models/AccountLink';
import type { AccountRaw } from 'common/lib/models/Account';
import type { ID } from 'common/types/core';
import type { ModelContainer } from '../datastore';
import type { Provider } from 'common/lib/models/Provider';
import type { UserInfo } from 'common/lib/models/UserInfo';

export type LoadStatus = 'STEADY' | 'FAILURE' | 'LOADING' | 'EMPTY';

export type ProviderContainer = { [providerID: ID]: Provider };

export type ProviderFetchStatus = 'EMPTY' | 'LOADING' | 'STEADY' | 'FAILURE';

export type AccountContainer = ModelContainer<'Account', AccountRaw>;

export type AccountLinkContainer = ModelContainer<'AccountLink', AccountLink>;

export type UserInfoContainer = { [userInfoID: ID]: UserInfo };

export type TransactionLoadingStatus =
  | 'EMPTY'
  | 'LOADING'
  | 'STEADY'
  | 'END_OF_INPUT'
  | 'FAILURE';
