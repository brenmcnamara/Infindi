/* @flow */

import { genYodleeProviderLogin } from '../../backend';
import { requestProviderLoginFailed } from '../action';

import type { PureAction, Next, Store } from '../../typesDEPRECATED/redux';

export default (store: Store) => (next: Next) => {
  return (action: PureAction) => {
    next(action);

    switch (action.type) {
      case 'REQUEST_PROVIDER_LOGIN': {
        const { provider } = action;
        genYodleeProviderLogin(provider).catch(error => {
          next(requestProviderLoginFailed(provider, error));
        });
      }
    }
  };
};
