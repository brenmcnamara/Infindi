/* @flow */

import { NativeModules } from 'react-native';

export type PlaidLinkPayload =
  | {|
      +metadata: Object,
      +publicToken: string,
      +type: 'LINK_SUCCESS',
    |}
  | {|
      +type: 'LINK_QUIT',
    |}
  | {|
      +errorMessage: string,
      +type: 'LINK_FAILURE',
    |};

export type PlaidLinkCompletionCallback = (payload: PlaidLinkPayload) => any;

export default {
  genIsAvailable(): Promise<bool> {
    return new Promise(resolve => {
      NativeModules.PlaidLink.checkAvailability(resolve);
    });
  },

  hide(): void {
    NativeModules.PlaidLink.hide();
  },

  show(callback: PlaidLinkCompletionCallback): void {
    NativeModules.PlaidLink.show(callback);
  },
};
