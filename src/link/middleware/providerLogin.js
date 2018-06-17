/* @flow */

import Backend from '../../backend';

import invariant from 'invariant';

import type { PureAction, Next, StoreType } from '../../store';

export default (store: StoreType) => (next: Next) => {
  return (action: PureAction) => {
    next(action);

    switch (action.type) {
      case 'SUBMIT_YODLEE_LOGIN_FORM_INITIALIZE': {
        const { operationID, providerID } = action;
        const loginForm = store.getState().accountVerification
          .loginFormContainer[providerID];
        invariant(
          loginForm,
          'Expecting login form to exist for provider id: %s',
          providerID,
        );
        Backend.genYodleeSubmitProviderLoginForm(providerID, loginForm)
          .then(response => {
            next({
              operationID,
              providerID,
              type: 'SUBMIT_YODLEE_LOGIN_FORM_SUCCESS',
            });
          })
          .catch(error => {
            next({
              error,
              operationID,
              providerID,
              type: 'SUBMIT_YODLEE_LOGIN_FORM_FAILURE',
            });
          });
      }
    }
  };
};
