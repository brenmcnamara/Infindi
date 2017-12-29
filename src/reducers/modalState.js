/* @flow */

import type { ID } from 'common/src/types/core';
import type { PureAction } from '../typesDEPRECATED/redux';

export type ModalPriority = 'SYSTEM_CRITICAL' | 'USER_REQUESTED';

export type Modal = Modal$Native | Modal$ReactWithTransition;

export type Modal$ReactWithTransition = {|
  +id: ID,
  +modalType: 'REACT_WITH_TRANSITION',
  +priority: ModalPriority,
  +renderIn: () => React$Element<*>,
  +renderInitial: () => React$Element<*>,
  +renderTransitionOut: () => React$Element<*>,
  +transitionInMillis: number,
  +transitionOutMillis: number,
|};

export type Modal$Native = {|
  +hide: () => any,
  +id: ID,
  +modalType: 'NATIVE',
  +priority: ModalPriority,
  +show: () => any,
|};

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
