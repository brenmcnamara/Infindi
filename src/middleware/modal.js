/* @flow */

import invariant from 'invariant';

import type { ID } from 'common/src/types/core';
import type { Modal } from '../reducers/modalState';
import type { Next, PureAction, Store } from '../typesDEPRECATED/redux';

export type Action = Action$UpdateModalStack;

export type Action$UpdateModalStack = {|
  +modalQueue: Array<Modal>,
  +type: 'UPDATE_MODAL_QUEUE',
|};

/**
 * This middleware manages the presentation of modals priority and presentation.
 * If there are multiple modals, the middleware will make sure that the most
 * important modal is displaying.
 *
 * If the modal is from native, then the middleware will perform the necessary
 * side effects to display and hide the modal.
 */
export default (store: Store) => (next: Next) => {
  let modalQueue: Array<Modal> = [];

  return (action: PureAction) => {
    next(action);

    switch (action.type) {
      case 'DISMISS_MODAL': {
        const index = modalQueue.findIndex(
          modal => modal.id === action.modalID,
        );
        if (index < 0) {
          break;
        }

        const newQueue = modalQueue.slice();
        newQueue.splice(index, 1);
        modalQueue = newQueue;

        next({
          modalQueue,
          type: 'UPDATE_MODAL_QUEUE',
        });
        break;
      }

      case 'REQUEST_MODAL': {
        const newQueue = addModalToPriorityQueue(action.modal, modalQueue);
        modalQueue = newQueue;

        next({
          modalQueue,
          type: 'UPDATE_MODAL_QUEUE',
        });
        break;
      }
    }
  };
};

// The smaller the num, the higher the priority.
const PRIORITY_TO_NUM = {
  SYSTEM_CRITICAL: 2,
  USER_REQUESTED: 3,
};

function getPriorityNum(modal: Modal): number {
  const num = PRIORITY_TO_NUM[modal.priority];
  invariant(
    typeof num === 'number' && !Number.isNaN(num),
    'Modal %s has no priority num for modal priority: %s',
    modal.id,
    modal.priority,
  );
  return num;
}

function addModalToPriorityQueue(
  modal: Modal,
  queue: Array<Modal>,
): Array<Modal> {
  const priorityNum = getPriorityNum(modal);
  for (let i = 0; i < queue.length; ++i) {
    // Check if the modal has higher priority or the same priority as this
    // modal. Modals pre-empt other modals with the same priority if they are
    // requested later.
    const nextModal = queue[i];
    if (priorityNum <= getPriorityNum(nextModal)) {
      const newQueue = queue.slice();
      newQueue.splice(i, 0, modal);
      return newQueue;
    }
  }
  // At this point, we did not add the modal. Just put the modal at the end of
  // the list.
  const newQueue = queue.slice();
  newQueue.push(modal);
  return newQueue;
}

function getDisplayedNativeModalID(queue: Array<Modal>): ?ID {
  return queue.length > 0 && queue[0].modalType === 'NATIVE'
    ? queue[0].id
    : null;
}
