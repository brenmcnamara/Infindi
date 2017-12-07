/* @flow */

import { type Action as Action$Auth } from '../actions/authentication';
import { type Action as Action$AuthMiddleware } from '../middleware/authentication';
import { type Action as Action$Nav } from '../actions/navigation';
import { type Action as Action$NavMiddleware } from '../middleware/navigation';
import { type State } from '../reducers/root';

export type ReduxProps = {
  +dispatch: Dispatch,
};

export type PureAction =
  | Action$Auth
  | Action$AuthMiddleware
  | Action$Nav
  | Action$NavMiddleware;

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

export type Next = (action: PureAction) => any;
