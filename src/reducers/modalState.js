/* @flow */

import type { ID } from 'common/src/types/core';

export type ModalPriority = 'SYSTEM_CRITICAL' | 'USER_REQUESTED';

export type Modal =
  | {|
      +hide: () => any,
      +id: ID,
      +modalType: 'NATIVE',
      +priority: ModalPriority,
      +show: () => any,
    |}
  | {|
      +id: ID,
      +modalType: 'REACT',
      +priority: ModalPriority,
      +render: () => React$Component<*>,
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
