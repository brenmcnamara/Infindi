/* @flow */

import type Provider from 'common/lib/models/Provider';
import type UserInfo from 'common/lib/models/UserInfo';

import type { ID } from 'common/types/core';

export type LoadStatusDEPRECATED = 'LOADING' | 'STEADY' | 'EMPTY' | 'FAILURE';
export type ProviderContainer = { [providerID: ID]: Provider };
export type ProviderFetchStatus = 'EMPTY' | 'LOADING' | 'STEADY' | 'FAILURE';
export type UserInfoContainer = {[userID: ID]: UserInfo};
