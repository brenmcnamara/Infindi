/* @flow */

import authentication from '../middleware/authentication';
import rootReducer from '../reducers/root';
import thunk from 'redux-thunk';

import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';

let middleware;

if (__DEV__) {
  const reduxLogger = createLogger({ collapsed: true });
  middleware = applyMiddleware(thunk, authentication, reduxLogger);
} else {
  middleware = applyMiddleware(thunk, authentication);
}

export default createStore(rootReducer, middleware);
