/* @flow */

import type { PureAction } from '../store';

// NOTE: Initial app inset is a hacky fix so that the keyboard avoiding view and
// safe area view
export type State = {
  hostname: string,
};

const DEFAULT_STATE: State = {
  // hostname: 'https://infindi.herokuapp.com',
  hostname: 'http://localhost:8080',
};

export default function configStatus(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  return state;
}
