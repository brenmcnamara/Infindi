/* @flow */

import authentication from '../middleware/authentication';
import rootReducer from '../reducers/root';
import thunk from 'redux-thunk';

import { applyMiddleware, createStore } from 'redux';

export type State = {||};

export default createStore(rootReducer, applyMiddleware(thunk, authentication));
