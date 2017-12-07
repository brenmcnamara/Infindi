/* @flow */

import { INITIAL_CONTROLS } from '../controls';

import type { Action } from '../types/redux';
import type { Controls } from '../controls';

export type State = Controls;

export default function navState(
  state: State = INITIAL_CONTROLS,
  action: Action,
): State {
  switch (action.type) {
    case 'SET_CONTROLS': {
      return action.controls;
    }
  }
  return state;
}
