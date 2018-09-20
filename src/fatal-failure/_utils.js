/* @flow */

import type { PureAction } from '../store';

export function isActionResolvingInitializationFailure(
  action: PureAction,
): boolean {
  return action.type === 'RETRY_LOGIN_INITIALIZATION';
}
