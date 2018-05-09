/* @flow */

import type { ID } from 'common/types/core';
import type { Toast } from '../reducers/toast';

export type Action =
  | Action$RequestMultipleToasts
  | Action$RequestToast
  | Action$DismissToast;

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

export type Action$RequestMultipleToasts = {|
  +toasts: Array<Toast>,
  +type: 'REQUEST_MULTIPLE_TOASTS',
|};

export function requestMultipleToasts(
  toasts: Array<Toast>,
): Action$RequestMultipleToasts {
  return {
    toasts,
    type: 'REQUEST_MULTIPLE_TOASTS',
  };
}

export type Action$DismissToast = {|
  +shouldThrowOnDismissingNonExistantToast: boolean,
  +toastID: ID,
  +type: 'DISMISS_TOAST',
|};

export function dismissToast(
  toastID: ID,
  shouldThrowOnDismissingNonExistantToast: boolean = true,
): Action$DismissToast {
  return {
    shouldThrowOnDismissingNonExistantToast,
    toastID,
    type: 'DISMISS_TOAST',
  };
}
