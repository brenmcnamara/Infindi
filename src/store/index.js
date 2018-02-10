/* @flow */

import accounts from '../middleware/accounts';
import authentication from '../middleware/authentication';
import modal from '../middleware/modal';
import network from '../middleware/network';
import providerLogin from '../yodlee/middleware/providerLogin';
import refreshInfo from '../middleware/refreshInfo';
import refreshInfoToast from '../yodlee/middleware/refreshInfoToast';
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
    refreshInfo,
    accounts,
    // plaid,
    providerLogin,
    // Then comes network middleware.
    network,
    // Then comes ui-managing middleware.
    modal,
    refreshInfoToast,
    toast,
    // Logging is last.
    reduxLogger,
  );
} else {
  middleware = applyMiddleware(
    // Thunk comes first.
    thunk,
    // Then comes middleware that need network access.
    authentication,
    refreshInfo,
    accounts,
    // plaid,
    providerLogin,
    // Then comes network middleware.
    network,
    // Then comes ui-managing middleware.
    modal,
    refreshInfoToast,
    toast,
    // Logging is last.
  );
}

export default createStore(rootReducer, middleware);
