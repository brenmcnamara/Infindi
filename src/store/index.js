/* @flow */

import AccountLinkMiddleware from '../data-model/middleware/AccountLink';
import AccountLinkFlowMiddleware from '../link/middleware/AccountLinkFlowMiddleware';
import AccountMiddleware from '../data-model/middleware/Account';
import ProviderLoginMiddleware from '../link/middleware/ProviderLoginMiddleware';
import ProviderMiddleware from '../data-model/middleware/Provider';
import TransactionMiddleware from '../data-model/middleware/Transaction';
import UserInfoMiddleware from '../data-model/middleware/UserInfo';

import authentication from '../auth/middleware';
import modal from '../middleware/modal';
import providerFuzzySearch from '../data-model/middleware/providerFuzzySearch';
import rootReducer from '../reducers/root';
import thunk from 'redux-thunk';
import toast from '../middleware/toast';

import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';

import type { Action as Action$Account } from '../data-model/actions/Account';
import type { Action as Action$AccountLink } from '../data-model/actions/AccountLink';
import type { Action as Action$ActionItems } from '../actions/actionItems';
import type { Action as Action$Auth } from '../auth/actions';
import type { Action as Action$LifeCycle } from '../life-cycle/Actions';
import type { Action as Action$Link } from '../link/action';
import type { Action as Action$Modal } from '../actions/modal';
import type { Action as Action$ModalMiddleware } from '../middleware/modal';
import type { Action as Action$Provider } from '../data-model/actions/Provider';
// eslint-disable-next-line max-len
import type { Action as Action$ProviderFuzzySearch } from '../data-model/actions/ProviderFuzzySearch';
import type { Action as Action$Router } from '../actions/router';
import type { Action as Action$Toast } from '../actions/toast';
import type { Action as Action$ToastMiddleware } from '../middleware/toast';
import type { Action as Action$Transaction } from '../data-model/actions/Transaction';
import type { Action as Action$UserInfo } from '../data-model/actions/UserInfo';
import type { Action as Action$WatchSession } from '../watch-session/actions';
import type { State } from '../reducers/root';

export type ReduxProps = {
  +dispatch: Dispatch,
};

export type PureAction =
  | Action$Account
  | Action$AccountLink
  | Action$ActionItems
  | Action$Auth
  | Action$LifeCycle
  | Action$Link
  | Action$Modal
  | Action$ModalMiddleware
  | Action$Provider
  | Action$ProviderFuzzySearch
  | Action$Router
  | Action$Toast
  | Action$ToastMiddleware
  | Action$Transaction
  | Action$UserInfo
  | Action$WatchSession;

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
const providerMiddleware = new ProviderMiddleware();
const providerLoginMiddleware = new ProviderLoginMiddleware();
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
    // DATA MODEL MIDDLEWARE
    // -------------------------------------------------------------------------
    accountLinkMiddleware.handle,
    accountMiddleware.handle,
    providerMiddleware.handle,
    transactionMiddleware.handle,
    userInfoMiddleware.handle,
    // -------------------------------------------------------------------------
    // LEGACY DATA MODEL MIDDLEWARE
    // -------------------------------------------------------------------------
    providerFuzzySearch,
    // -------------------------------------------------------------------------
    // UI MIDDLEWARE
    // -------------------------------------------------------------------------
    providerLoginMiddleware.handle,
    // Then comes ui-managing middleware.
    accountLinkFlowMiddleware.handle,
    modal,
    toast,
    // Logging is last.
    reduxLogger,
  );
} else {
  middleware = applyMiddleware(
    // Thunk comes first.
    thunk,
    // Then comes middleware that need network access.
    authentication,
    // -------------------------------------------------------------------------
    // DATA MODEL MIDDLEWARE
    // -------------------------------------------------------------------------
    accountLinkMiddleware.handle,
    accountMiddleware.handle,
    providerMiddleware.handle,
    transactionMiddleware.handle,
    userInfoMiddleware.handle,
    // -------------------------------------------------------------------------
    // LEGACY DATA MODEL MIDDLEWARE
    // -------------------------------------------------------------------------
    providerFuzzySearch,
    // -------------------------------------------------------------------------
    // UI MIDDLEWARE
    // -------------------------------------------------------------------------
    providerLoginMiddleware.handle,
    // Then comes ui-managing middleware.
    accountLinkFlowMiddleware.handle,
    modal,
    toast,
  );
}

export default createStore(rootReducer, middleware);
