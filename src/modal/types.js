/* @flow */

import type { ID } from 'common/types/core';

export type ModalPriority = 'SYSTEM_CRITICAL' | 'USER_REQUESTED';

export type Modal = Modal$Native | Modal$ReactWithTransition;

export type TransitionStage = 'IN' | 'OUT' | 'TRANSITION_IN' | 'TRANSITION_OUT';

export type Modal$ReactWithTransition = {|
  +id: ID,
  +modalType: 'REACT_WITH_TRANSITION',
  +priority: ModalPriority,
  +renderIn: () => React$Element<*>,
  +renderOut: () => React$Element<*>,
  +renderTransitionIn: () => React$Element<*>,
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
