/* @flow */

import invariant from 'invariant';

import type { AccountLinkStatus } from 'common/lib/models/AccountLink';
import type { LoginForm as YodleeLoginForm } from 'common/types/yodlee';
import type { Provider } from 'common/lib/models/Provider';

export type AccountVerificationPage =
  | {|
      +search: string,
      +type: 'SEARCH_ERROR',
    |}
  | {|
      +providers: Array<Provider>,
      +search: string,
      +type: 'SEARCH',
    |}
  | {|
      +providers: Array<Provider>,
      +search: string,
      +selectedProvider: Provider,
      +type: 'LOGIN',
    |};

export type SupportType =
  | {|
      +type: 'YES',
    |}
  | {|
      +reason: string,
      +type: 'NO',
    |};

export function isSupportedProvider(provider: Provider): SupportType {
  invariant(
    provider.sourceOfTruth.type === 'YODLEE',
    'Expecting provider to come from yodlee',
  );
  const yodleeProvider = provider.sourceOfTruth.value;
  if (!yodleeProvider.loginForm) {
    return { reason: 'This provider has no login form', type: 'NO' };
  }

  const { loginForm } = yodleeProvider;

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

// Check if 2 forms are equivalent when all the entered values are ignored.
export function isSameLoginForm(
  loginForm1: YodleeLoginForm,
  loginForm2: YodleeLoginForm,
): bool {
  if (loginForm1.row.length !== loginForm2.row.length) {
    return false;
  }
  for (let i = 0; i < loginForm1.row.length; ++i) {
    if (loginForm1.row[i].id !== loginForm2.row[i].id) {
      return false;
    }
    const field1 = loginForm1.row[i].field;
    const field2 = loginForm2.row[i].field;
    if (field1.length !== field2.length) {
      return false;
    }
    for (let j = 0; j < field1.length; ++j) {
      if (field1[j].id !== field2[j].id) {
        return false;
      }
    }
  }
  return true;
}

export const PRE_DOWNLOADING_STATUSES: Array<AccountLinkStatus> = [
  'FAILURE / BAD_CREDENTIALS',
  'IN_PROGRESS / INITIALIZING',
  'IN_PROGRESS / VERIFYING_CREDENTIALS',
  'MFA / PENDING_USER_INPUT',
  'MFA / WAITING_FOR_LOGIN_FORM',
];

export const POST_DOWNLOADING_STATUSES: Array<AccountLinkStatus> = [
  'IN_PROGRESS / DOWNLOADING_DATA',
  'SUCCESS',
];
