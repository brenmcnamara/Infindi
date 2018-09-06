/* @flow */

import invariant from 'invariant';

import type { Modal } from '../modal/types';
import type { Next, PureAction, StoreType } from '../store';

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
export default (store: StoreType) => (next: Next) => {
  let modalQueue: Array<Modal> = [];

  return (action: PureAction) => {
    next(action);

    switch (action.type) {
      case 'DISMISS_MODAL': {
        const { modalID } = action;
        const index = modalQueue.findIndex(modal => modal.id === modalID);
        invariant(
          index >= 0,
          'Trying to dismiss modal that does not exist: %s',
          action.modalID,
        );

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
        const { modal } = action;
        const index = modalQueue.findIndex(_modal => _modal.id === modal.id);
        invariant(
          index < 0,
          'Trying to add multiple modals with the id: %s',
          action.modal.id,
        );
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
