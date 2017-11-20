/* @flow */

import authStatus, { type State as State$AuthStatus } from './authStatus';

import { combineReducers } from 'redux';

export type State = {|
  +authStatus: State$AuthStatus,
|};

export default combineReducers({ authStatus });
