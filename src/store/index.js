/* @flow */

import authentication from '../middleware/authentication';
import datastore from '../middleware/datastore';
import modal from '../middleware/modal';
import network from '../middleware/network';
// import plaid from '../middleware/plaid';
import rootReducer from '../reducers/root';
import thunk from 'redux-thunk';
import toast from '../middleware/toast';

import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';

let middleware;

if (__DEV__) {
  const reduxLogger = createLogger({ collapsed: true });
  middleware = applyMiddleware(
    // Thunk comes first.
    thunk,
    // Then comes middleware that need network access.
    authentication,
    datastore,
    // plaid,
    // Then comes network middleware.
    network,
    // Then comes ui-managing middleware.
    modal,
    toast,
    // Logging is last.
    // reduxLogger,
  );
} else {
  middleware = applyMiddleware(
    // Thunk comes first.
    thunk,
    // Then comes middleware that need network access.
    authentication,
    datastore,
    // plaid,
    // Then comes network middleware.
    network,
    // Then comes ui-managing middleware.
    modal,
    toast,
    // Logging is last.
  );
}

export default createStore(rootReducer, middleware);
