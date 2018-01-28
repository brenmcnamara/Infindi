/* @flow */

import type { Provider as YodleeProvider } from 'common/lib/models/YodleeProvider';

export type SupportType =
  | {|
      +type: 'YES',
    |}
  | {|
      +reason: string,
      +type: 'NO',
    |};

export function isSupportedProvider(provider: YodleeProvider): SupportType {
  const { raw } = provider;
  if (!raw.loginForm) {
    return { reason: 'This provider has no login form', type: 'NO' };
  }

  const { loginForm } = raw;

  if (!loginForm.row || loginForm.row.length === 0) {
    return { reason: 'This provider has a malformed loginForm', type: 'NO' };
  }

  if (loginForm.row.some(entry => !entry.field || entry.field.length !== 1)) {
    return {
      reason: 'Provider login forms should have row.field of length 1',
      type: 'NO',
    };
  }

  const VALID_FIELDS = ['text', 'password'];
  const hasAllValidFields = loginForm.row.every(entry =>
    VALID_FIELDS.includes(entry.field[0].type),
  );

  if (!hasAllValidFields) {
    return {
      reason: 'Provider login fields must be of type text or password',
      type: 'NO',
    };
  }
  return { type: 'YES' };
}
