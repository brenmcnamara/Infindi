/* @flow */

/**
 * This module controls the presentation of all modal views.
 */

import type { ID } from 'common/src/types/core';
import type { Modal } from '../reducers/modal';

export type Action = Action$HideModal | Action$ShowModal;

export type Action$DismissModal = {|
  +modalID: ID,
  +type: 'HIDE_MODAL',
|};

export type Action$RequestModal = {|
  +modal: Modal,
  +type: 'REQUEST_MODAL',
|};
