/* @flow */

import type { ID } from 'common/src/types/core';

export type ModalPriority = 'SYSTEM_CRITICAL' | 'USER_REQUESTED';

export type Modal = Modal$Native | Modal$React;

export type Model$React = {|
  +id: ID,
  +modalType: 'REACT',
  +priority: ModalPriority,
  +render: () => React$Component<*>,
  +renderTransitionOut?: () => React$Component<*>,
  +transitionOutMillis?: number,
|};

export type Modal$Native = {|
  +hide: () => any,
  +id: ID,
  +modalType: 'NATIVE',
  +priority: ModalPriority,
  +show: () => any,
|};

export type State = {|
  +modalQueue: Array<Modal>,
|};

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
