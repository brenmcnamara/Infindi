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
  hide(): void {
    NativeModules.PlaidLink.hide();
  },

  show(callback: PlaidLinkCompletionCallback): void {
    NativeModules.PlaidLink.show(callback);
  },
};
