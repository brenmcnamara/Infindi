/* @flow */

import { genYodleeSubmitProviderLoginForm } from '../../backend';

import type { PureAction, Next, Store } from '../../typesDEPRECATED/redux';

export default (store: Store) => (next: Next) => {
  return (action: PureAction) => {
    next(action);

    switch (action.type) {
      case 'SUBMIT_YODLEE_LOGIN_FORM_INITIALIZE': {
        const { loginForm, operationID, providerID } = action;
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
