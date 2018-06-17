/* @flow */

import accountLinks from '../middleware/accountLinks';
import accountLinkFlow from '../link/middleware/accountLinkFlow';
import accounts from '../middleware/accounts';
import authentication from '../auth/middleware';
import modal from '../middleware/modal';
import providerLogin from '../link/middleware/providerLogin';
import providers from '../data-model/middleware/providers';
import rootReducer from '../reducers/root';
import thunk from 'redux-thunk';
import toast from '../middleware/toast';
import transactions from '../middleware/transactions';
import userInfo from '../data-model/middleware/userInfo';
import watchSession from '../watch-session/middleware/watch-session';

import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';

import type Account, { AccountRaw } from 'common/lib/models/Account';
import type AccountLink, {
  AccountLinkRaw,
} from 'common/lib/models/AccountLink';
import type Transaction, {
  TransactionRaw,
} from 'common/lib/models/Transaction';

import type { Action as Action$ActionItems } from '../actions/actionItems';
import type { Action as Action$Auth } from '../auth/actions';
import type { Action as Action$DataModel } from '../data-model/actions';
import type { Action as Action$Datastore } from '../datastore';
import type { Action as Action$Link } from '../link/action';
import type { Action as Action$Modal } from '../actions/modal';
import type { Action as Action$ModalMiddleware } from '../middleware/modal';
import type { Action as Action$Router } from '../actions/router';
import type { Action as Action$Toast } from '../actions/toast';
import type { Action as Action$ToastMiddleware } from '../middleware/toast';
import type { Action as Action$WatchSession } from '../watch-session/actions';
import type { State } from '../reducers/root';

export type ReduxProps = {
  +dispatch: Dispatch,
};

export type PureAction =
  | Action$ActionItems
  | Action$Auth
  | Action$DataModel
  | Action$Datastore<'Account', AccountRaw, Account>
  | Action$Datastore<'AccountLink', AccountLinkRaw, AccountLink>
  | Action$Datastore<'Transaction', TransactionRaw, Transaction>
  | Action$Link
  | Action$Modal
  | Action$ModalMiddleware
  | Action$Router
  | Action$Toast
  | Action$ToastMiddleware
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

let middleware;

if (__DEV__) {
  const reduxLogger = createLogger({ collapsed: true });
  middleware = applyMiddleware(
    // Thunk comes first.
    thunk,
    // Then comes middleware that need network access.
    authentication,
    watchSession,
    userInfo,
    providers,
    accountLinks,
    accounts,
    transactions,
    providerLogin,
    // Then comes ui-managing middleware.
    accountLinkFlow,
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
    watchSession,
    userInfo,
    providers,
    accountLinks,
    accounts,
    transactions,
    providerLogin,
    // Then comes ui-managing middleware.
    accountLinkFlow,
    modal,
    toast,
  );
}

export default createStore(rootReducer, middleware);
