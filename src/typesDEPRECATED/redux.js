/* @flow */

import type { Account } from 'common/src/types/db';
import type { Action as Action$Auth } from '../actions/authentication';
import type { Action as Action$AuthMiddleware } from '../middleware/authentication';
import type { Action as Action$Config } from '../actions/config';
import type { Action as Action$Datastore } from '../datastore';
import type { Action as Action$Modal } from '../actions/modal';
import type { Action as Action$ModalMiddleware } from '../middleware/modal';
import type { Action as Action$Nav } from '../actions/navigation';
import type { Action as Action$NavMiddleware } from '../middleware/navigation';
import type { Action as Action$Network } from '../actions/network';
import type { Action as Action$NetworkMiddleware } from '../middleware/network';
import type { Action as Action$Plaid } from '../actions/plaid';
import type { Action as Action$PlaidMiddleware } from '../middleware/plaid';
import type { State } from '../reducers/root';

export type ReduxProps = {
  +dispatch: Dispatch,
};

export type PureAction =
  | Action$Auth
  | Action$AuthMiddleware
  | Action$Config
  | Action$Datastore<'Account', Account>
  | Action$Modal
  | Action$ModalMiddleware
  | Action$Nav
  | Action$NavMiddleware
  | Action$Network
  | Action$NetworkMiddleware
  | Action$Plaid
  | Action$PlaidMiddleware;

export type ThunkAction = (dispatch: Dispatch) => void;

export type Action = PureAction | ThunkAction;

export type ChangeStoreCallback = () => void;

export type StoreSubscription = () => void;

export type ReduxState = State;

export type Store = {|
  +dispatch: Dispatch,
  +getState: () => State,
  +subscription: (cb: ChangeStoreCallback) => StoreSubscription,
|};

export type Dispatch = (action: Action) => void;

export type Next = (action: PureAction) => any;

export type Reducer<TState> = (state: TState, action: PureAction) => TState;

// TODO: Can we make this more precise?
export type CombineReducers<TState: Object> = (reducerMap: {
  [key: string]: Reducer<*>,
}) => Reducer<TState>;
