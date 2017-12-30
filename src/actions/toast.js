/* @flow */

import type { ID } from 'common/src/types/core';
import type { Toast } from '../reducers/toast';

export type Action = Action$RequestToast | Action$DismissToast;

export type Action$RequestToast = {|
  +toast: Toast,
  +type: 'REQUEST_TOAST',
|};

export function requestToast(toast: Toast): Action$RequestToast {
  return {
    toast,
    type: 'REQUEST_TOAST',
  };
}

export type Action$DismissToast = {|
  +toastID: ID,
  +type: 'DISMISS_TOAST',
|};

export function dismissToast(toastID: ID): Action$DismissToast {
  return {
    toastID,
    type: 'DISMISS_TOAST',
  };
}
