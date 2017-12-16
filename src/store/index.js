/* @flow */

import authentication from '../middleware/authentication';
import datastore from '../middleware/datastore';
import navigation from '../middleware/navigation';
import plaid from '../middleware/plaid';
import rootReducer from '../reducers/root';
import thunk from 'redux-thunk';

import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';

let middleware;

if (__DEV__) {
  const reduxLogger = createLogger({ collapsed: true });
  middleware = applyMiddleware(
    thunk,
    authentication,
    datastore,
    navigation,
    plaid,
    // reduxLogger,
  );
} else {
  middleware = applyMiddleware(
    thunk,
    authentication,
    datastore,
    navigation,
    plaid,
  );
}

export default createStore(rootReducer, middleware);
