/* @flow */

import invariant from 'invariant';

import { NativeModules } from 'react-native';

import type { VerificationService } from '../reducers/configState';

let variables: ?Object = null;

export default {
  genLazyLoad(): Promise<void> {
    if (variables) {
      return Promise.resolve();
    }
    return new Promise(resolve => {
      NativeModules.Environment.fetchVariables(_variables => {
        variables = _variables;
        resolve();
      });
    });
  },

  getHostname(): string {
    return getVariables().hostname;
  },

  getVerificationService(): VerificationService {
    return getVariables().verificationService;
  },

  isLoaded(): bool {
    return variables !== null;
  },
};

function getVariables(): Object {
  invariant(
    variables,
    'Cannot fetch environment variables until Environment is loaded',
  );
  return variables;
}
