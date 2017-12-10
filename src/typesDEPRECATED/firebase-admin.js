/* @flow */

import { type SecondsSinceEpoch } from './core';

export type FirebaseAdmin$ErrorCode =
  | 'auth/claims-too-large'
  | 'auth/invalid-argument'
  | 'auth/invalid-claims'
  | 'auth/invalid-disbaled-field'
  | 'auth/invalid-display-name'
  | 'auth/invalid-email-verified'
  | 'auth/invalid-email'
  | 'auth/invalid-page-token'
  | 'auth/invalid-password'
  | 'auth/invalid-phone-number'
  | 'auth/invalid-photo-url'
  | 'auth/invalid-uid'
  | 'auth/missing-uid'
  | 'auth/reserved-claims'
  | 'auth/uid-already-exists'
  | 'auth/email-already-exists'
  | 'auth/user-not-found'
  | 'auth/operation-not-allowed'
  | 'auth/invalid-credential'
  | 'auth/phone-number-already-exists'
  | 'auth/insufficient-permission'
  | 'auth/internal-error';

// https://firebase.google.com/docs/reference/admin/node/admin.auth.DecodedIdToken
export type DecodedIDToken = {|
  +aud: string,
  +auth_time: SecondsSinceEpoch,
  +exp: SecondsSinceEpoch,
  +firebase: Object,
  +iat: SecondsSinceEpoch,
  +sub: string,
  +uid: string,
|};
