/* @flow */

import type { Modal } from './types';
import type { PureAction } from '../store';

export type State = {
  +modalQueue: Array<Modal>,
};

const DEFAULT_STATE: State = {
  modalQueue: [],
};

export default function modalState(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'UPDATE_MODAL_QUEUE': {
      return { ...state, modalQueue: action.modalQueue };
    }
  }
  return state;
}
