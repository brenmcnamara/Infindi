/* @flow */

import authStatus, { type State as State$AuthStatus } from './authStatus';
import navState, { type State as State$NavState } from './navState';

import { combineReducers } from 'redux';

export type State = {|
  +authStatus: State$AuthStatus,
  +navState: State$NavState,
|};

export default combineReducers({ authStatus, navState });
