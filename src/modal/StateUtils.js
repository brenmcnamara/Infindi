/* @flow */

import type { ID } from 'common/types/core';
import type { Modal } from './types';
import type { ReduxState } from '../store';

function getModalForID(state: ReduxState, modalID: ID): Modal | null {
  return state.modal.modalQueue.find(modal => modal.id === modalID) || null;
}

export default {
  getModalForID,
};
