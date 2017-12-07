/* @flow */

import authStatus, { type State as State$AuthStatus } from './authStatus';
import navControls, { type State as State$NavControls } from './navControls';

import { combineReducers } from 'redux';

export type State = {|
  +authStatus: State$AuthStatus,
  +navControls: State$NavControls,
|};

export default combineReducers({ authStatus, navControls });
