/* @flow */

// TODO: Rename to navState

import invariant from 'invariant';

import { INITIAL_CONTROLS } from '../controls';

import type { Action } from '../types/redux';
import type { Controls } from '../controls';

export type State =
  | {|
      +incomingControls: Controls,
      +previousControls: Controls,
      +transitionStatus: 'IN_PROGRESS',
    |}
  | {|
      +controls: Controls,
      +transitionStatus: 'COMPLETE',
    |};

const DEFAULT_STATE: State = {
  controls: INITIAL_CONTROLS,
  transitionStatus: 'COMPLETE',
};

export default function navState(
  state: State = DEFAULT_STATE,
  action: Action,
): State {
  switch (action.type) {
    case 'SET_CONTROLS': {
      if (action.transitionStatus === 'IN_PROGRESS') {
        invariant(
          state.transitionStatus === 'COMPLETE',
          'Can only transition to IN_PROGRESS controls from COMPLETE controls',
        );
        return {
          incomingControls: action.controls,
          previousControls: state.controls,
          transitionStatus: 'IN_PROGRESS',
        };
      } else {
        return {
          controls: action.controls,
          transitionStatus: 'COMPLETE',
        };
      }
    }
  }
  return state;
}
