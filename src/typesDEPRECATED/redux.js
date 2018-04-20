/* @flow */

import type { Account } from 'common/lib/models/Account';
import type { AccountLink } from 'common/lib/models/AccountLink';
import type { Action as Action$ActionItems } from '../actions/actionItems';
import type { Action as Action$Auth } from '../auth/actions';
import type { Action as Action$Config } from '../actions/config';
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
import type { Transaction } from 'common/lib/models/Transaction';

export type ReduxProps = {
  +dispatch: Dispatch,
};

export type PureAction =
  | Action$ActionItems
  | Action$Auth
  | Action$Config
  | Action$DataModel
  | Action$Datastore<'Account', Account>
  | Action$Datastore<'AccountLink', AccountLink>
  | Action$Datastore<'Transaction', Transaction>
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

export type Store = {|
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
