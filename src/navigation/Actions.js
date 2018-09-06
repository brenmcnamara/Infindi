/* @flow */

import type { ID } from 'common/types/core';
import type { TabName } from './types';

export type Action =
  | Action$ExitAccountDetails
  | Action$SetShouldShowSignUpScreen
  | Action$ViewTab
  | Action$ViewAccountDetails
  | Action$ViewProviderLogin
  | Action$ViewProviderSearch;

export type Action$ViewTab = {|
  +tabName: TabName,
  +type: 'VIEW_TAB',
|};

export type Action$ViewAccountDetails = {|
  +accountID: ID,
  +type: 'VIEW_ACCOUNT_DETAILS',
|};

export type Action$ViewProviderSearch = {|
  +type: 'VIEW_PROVIDER_SEARCH',
|};

export type Action$ViewProviderLogin = {|
  +providerID: ID,
  +type: 'VIEW_PROVIDER_LOGIN',
|};

export type Action$ExitAccountDetails = {|
  +type: 'EXIT_ACCOUNT_DETAILS',
|};

export function viewTab(tabName: TabName) {
  return {
    tabName,
    type: 'VIEW_TAB',
  };
}

export function viewAccountDetails(accountID: ID) {
  return {
    accountID,
    type: 'VIEW_ACCOUNT_DETAILS',
  };
}

export function viewProviderSearch() {
  return { type: 'VIEW_PROVIDER_SEARCH' };
}

export function viewProviderLogin(providerID: ID) {
  return { providerID, type: 'VIEW_PROVIDER_LOGIN' };
}

export function exitAccountDetails() {
  return {
    type: 'EXIT_ACCOUNT_DETAILS',
  };
}

export type Action$SetShouldShowSignUpScreen = {|
  +show: boolean,
  +type: 'SET_SHOULD_SHOW_SIGN_UP_SCREEN',
|};

export function setShouldShowSignUpScreen(show: boolean) {
  return {
    show,
    type: 'SET_SHOULD_SHOW_SIGN_UP_SCREEN',
  };
}
