/* @flow */

import { type Action as Action$Auth } from '../actions/authentication';
import { type State } from '../reducers/root';

export type ReduxProps = {
  +dispatch: Dispatch,
};

export type PureAction = Action$Auth;

export type ThunkAction = (dispatch: Dispatch) => void;

export type Action = PureAction | ThunkAction;

export type ChangeStoreCallback = () => void;

export type StoreSubscription = () => void;

export type Store = {|
  +dispatch: Dispatch,
  +getState: () => State,
  +subscription: (cb: ChangeStoreCallback) => StoreSubscription,
|};

export type Dispatch = (action: Action) => void;
