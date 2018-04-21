/* @flow */

import invariant from 'invariant';

import { genYodleeSubmitProviderLoginForm } from '../../backend';

import type { PureAction, Next, Store } from '../../store';

export default (store: Store) => (next: Next) => {
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
        genYodleeSubmitProviderLoginForm(providerID, loginForm)
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
