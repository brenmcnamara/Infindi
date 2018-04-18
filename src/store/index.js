/* @flow */

import accountLinks from '../middleware/accountLinks';
import accountLinkFlow from '../link/middleware/accountLinkFlow';
import accounts from '../middleware/accounts';
import authentication from '../auth/middleware';
import eagleView from '../eagle-view/middleware/eagle-view';
import modal from '../middleware/modal';
import providerLogin from '../link/middleware/providerLogin';
import providers from '../data-model/middleware/providers';
import rootReducer from '../reducers/root';
import thunk from 'redux-thunk';
import toast from '../middleware/toast';
import transactions from '../middleware/transactions';
import userInfo from '../data-model/middleware/userInfo';

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
    eagleView,
    userInfo,
    providers,
    accountLinks,
    accounts,
    transactions,
    providerLogin,
    // Then comes ui-managing middleware.
    accountLinkFlow,
    modal,
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
    eagleView,
    userInfo,
    providers,
    accountLinks,
    accounts,
    transactions,
    providerLogin,
    // Then comes ui-managing middleware.
    accountLinkFlow,
    modal,
    toast,
  );
}

export default createStore(rootReducer, middleware);
