/* @flow */

import authentication from '../middleware/authentication';
import navigation from '../middleware/navigation';
import rootReducer from '../reducers/root';
import thunk from 'redux-thunk';

import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';

let middleware;

if (__DEV__) {
  const reduxLogger = createLogger({ collapsed: true });
  middleware = applyMiddleware(thunk, authentication, navigation, reduxLogger);
} else {
  middleware = applyMiddleware(thunk, authentication, navigation);
}

export default createStore(rootReducer, middleware);
