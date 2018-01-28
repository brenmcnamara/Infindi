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
      reason:
        'Currently, provider login forms should have row.field of length 1',
      type: 'NO',
    };
  }

  return { type: 'YES' };
}
