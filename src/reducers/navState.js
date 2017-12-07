/* @flow */

import invariant from 'invariant';

import { INITIAL_CONTROLS_PAYLOAD } from '../controls';

import type { Action } from '../types/redux';
import type { ControlsPayload } from '../controls';

// TODO: This type is not getting applied by flow. Why?
export type State =
  | {|
      +incomingControlsPayload: ControlsPayload,
      +previousControlsPayload: ControlsPayload,
      +transitionStatus: 'IN_PROGRESS',
    |}
  | {|
      +controlsPayload: ControlsPayload,
      +transitionStatus: 'COMPLETE',
    |};

// TODO: Flow is not type-checking this. Why?
const DEFAULT_STATE: State = {
  controlsPayload: INITIAL_CONTROLS_PAYLOAD,
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
          incomingControlsPayload: action.controlsPayload,
          previousControlsPayload: state.controlsPayload,
          transitionStatus: 'IN_PROGRESS',
        };
      } else {
        return {
          controlsPayload: action.controlsPayload,
          transitionStatus: 'COMPLETE',
        };
      }
    }
  }
  return state;
}
