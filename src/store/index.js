/* @flow */

import authentication from '../middleware/authentication';
import rootReducer from '../reducers/root';
import thunk from 'redux-thunk';

import { applyMiddleware, createStore } from 'redux';

import { type State as State$LoginStatus } from '../reducers/loginStatus';

export type State = {|
  +loginStatus: State$LoginStatus,
|};

export default createStore(rootReducer, applyMiddleware(thunk, authentication));
