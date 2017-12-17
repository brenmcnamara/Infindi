/* @flow */

import invariant from 'invariant';

import { NativeModules } from 'react-native';

let variables: ?Object = null;

export default {
  genLoad(): Promise<void> {
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
};

function getVariables(): Object {
  invariant(
    variables,
    'Cannot fetch environment variables until Environment is loaded',
  );
  return variables;
}
