/* @flow */

import AccountLinkMiddleware from '../data-model/middleware/AccountLink';
import AccountLinkFlowMiddleware from '../link/middleware/AccountLinkFlowMiddleware';
import AccountMiddleware from '../data-model/middleware/Account';
import ProviderFuzzySearchMiddleware from '../data-model/middleware/ProviderFuzzySearch';
import ProviderLoginMiddleware from '../link/middleware/ProviderLoginMiddleware';
import ProviderMiddleware from '../data-model/middleware/Provider';
import TransactionMiddleware from '../data-model/middleware/Transaction';
import UserInfoMiddleware from '../data-model/middleware/UserInfo';

import authentication from '../auth/middleware';
import modal from '../modal/middleware';
import rootReducer from './RootReducer';
import thunk from 'redux-thunk';
import banner from '../banner/middleware';

import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';

import type { Action as Action$Account } from '../data-model/actions/Account';
import type { Action as Action$AccountLink } from '../data-model/actions/AccountLink';
import type { Action as Action$ActionItems } from '../action-items/Actions';
import type { Action as Action$Auth } from '../auth/Actions';
import type { Action as Action$Banner } from '../banner/Actions';
import type { Action as Action$BannerMiddleware } from '../banner/middleware';
import type { Action as Action$LifeCycle } from '../life-cycle/Actions';
import type { Action as Action$Link } from '../link/Actions';
import type { Action as Action$Modal } from '../modal/Actions';
import type { Action as Action$ModalMiddleware } from '../modal/middleware';
import type { Action as Action$Navigation } from '../navigation/Actions';
import type { Action as Action$Provider } from '../data-model/actions/Provider';
// eslint-disable-next-line max-len
import type { Action as Action$ProviderFuzzySearch } from '../data-model/actions/ProviderFuzzySearch';
import type { Action as Action$Transaction } from '../data-model/actions/Transaction';
import type { Action as Action$UserInfo } from '../data-model/actions/UserInfo';
import type { State } from './RootReducer';

export type ReduxProps = {
  +dispatch: Dispatch,
};

export type PureAction =
  | Action$Account
  | Action$AccountLink
  | Action$ActionItems
  | Action$Auth
  | Action$Banner
  | Action$BannerMiddleware
  | Action$LifeCycle
  | Action$Link
  | Action$Modal
  | Action$ModalMiddleware
  | Action$Navigation
  | Action$Provider
  | Action$ProviderFuzzySearch
  | Action$Transaction
  | Action$UserInfo;

export type ThunkAction = (dispatch: PureDispatch, getState: GetState) => any;

export type Action = PureAction | ThunkAction;

export type ChangeStoreCallback = () => void;

export type StoreSubscription = () => void;

export type ReduxState = State;

export type GetState = () => State;

export type StoreType = {|
  +dispatch: Dispatch,
  +getState: GetState,
  +subscription: (cb: ChangeStoreCallback) => StoreSubscription,
|};

export type PureDispatch = (action: PureAction) => void;

export type Dispatch = (action: Action) => void;

export type Next = (action: PureAction) => any;

export type Reducer<TState> = (state: TState, action: PureAction) => TState;

// TODO: Can we make this more precise?
export type CombineReducers<TState: Object> = (reducerMap: {
  [key: string]: Reducer<*>,
}) => Reducer<TState>;

const accountLinkMiddleware = new AccountLinkMiddleware();
const accountMiddleware = new AccountMiddleware();
const accountLinkFlowMiddleware = new AccountLinkFlowMiddleware();
const providerFuzzySearchMiddleware = new ProviderFuzzySearchMiddleware();
const providerLoginMiddleware = new ProviderLoginMiddleware();
const providerMiddleware = new ProviderMiddleware();

const transactionMiddleware = new TransactionMiddleware();
const userInfoMiddleware = new UserInfoMiddleware();

let middleware;

if (__DEV__) {
  const reduxLogger = createLogger({ collapsed: true });
  middleware = applyMiddleware(
    // Thunk comes first.
    thunk,
    // Then comes middleware that need network access.
    authentication,
    // -------------------------------------------------------------------------
    // BOILERPLATE DATA MODEL MIDDLEWARE
    // -------------------------------------------------------------------------
    accountLinkMiddleware.handle,
    accountMiddleware.handle,
    providerMiddleware.handle,
    transactionMiddleware.handle,
    userInfoMiddleware.handle,
    // -------------------------------------------------------------------------
    // CUSTOM DATA MODEL MIDDLEWARE
    // -------------------------------------------------------------------------
    providerFuzzySearchMiddleware.handle,
    // -------------------------------------------------------------------------
    // UI MIDDLEWARE
    // -------------------------------------------------------------------------
    providerLoginMiddleware.handle,
    // Then comes ui-managing middleware.
    accountLinkFlowMiddleware.handle,
    modal,
    banner,
    // Logging is last.
    // reduxLogger,
  );
} else {
  middleware = applyMiddleware(
    // Thunk comes first.
    thunk,
    // Then comes middleware that need network access.
    authentication,
    // -------------------------------------------------------------------------
    // BOILERPLATE DATA MODEL MIDDLEWARE
    // -------------------------------------------------------------------------
    accountLinkMiddleware.handle,
    accountMiddleware.handle,
    providerMiddleware.handle,
    transactionMiddleware.handle,
    userInfoMiddleware.handle,
    // -------------------------------------------------------------------------
    // CUSTOM DATA MODEL MIDDLEWARE
    // -------------------------------------------------------------------------
    providerFuzzySearchMiddleware.handle,
    // -------------------------------------------------------------------------
    // UI MIDDLEWARE
    // -------------------------------------------------------------------------
    providerLoginMiddleware.handle,
    // Then comes ui-managing middleware.
    accountLinkFlowMiddleware.handle,
    modal,
    banner,
  );
}

export default createStore(rootReducer, middleware);
