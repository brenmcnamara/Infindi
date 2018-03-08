/* @flow */

import accountLinks from '../middleware/accountLinks';
import accountLinkToast from '../link/middleware/accountLinkToast';
import accounts from '../middleware/accounts';
import authentication from '../middleware/authentication';
import modal from '../middleware/modal';
import providerLogin from '../link/middleware/providerLogin';
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
    accountLinks,
    accounts,
    // plaid,
    providerLogin,
    // Then comes ui-managing middleware.
    modal,
    accountLinkToast,
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
    accountLinks,
    accounts,
    // plaid,
    providerLogin,
    // Then comes ui-managing middleware.
    modal,
    accountLinkToast,
    toast,
  );
}

export default createStore(rootReducer, middleware);
