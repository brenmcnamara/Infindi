/* @flow */

import HomeToActionItemTransitionModal, {
  TransitionInMillis as ModalTransitionInMillis,
  TransitionOutMillis as ModalTransitionOutMillis,
} from '../components/HomeToActionItemTransitionModal.react';
import React from 'react';

import invariant from 'invariant';

import type { ID } from 'common/types/core';
import type { Dispatch, ReduxState } from '../typesDEPRECATED/redux';

export type Action =
  | Action$DeleteActionItem
  | Action$FocusedActionItemChange
  | Action$SelectActionItem
  | Action$UnselectCurrentActionItem;

export type Action$FocusedActionItemChange = {|
  +actionItemID: ID,
  +type: 'FOCUSED_ACTION_ITEM_CHANGE',
|};

export function focusedActionItemChange(id: ID) {
  return {
    actionItemID: id,
    type: 'FOCUSED_ACTION_ITEM_CHANGE',
  };
}

export type Action$DeleteActionItem = {|
  +actionItemID: ID,
  +type: 'DELETE_ACTION_ITEM',
|};

export function deleteActionItem(id: ID) {
  return {
    actionItemID: id,
    type: 'DELETE_ACTION_ITEM',
  };
}

// NOTE: The only way to present a action item now is by clicking on the
// card in the dialog. We may need to add support for other transitions in the
// future as we create other mechanisms.

export type Action$SelectActionItem = {|
  +actionItemID: ID,
  +type: 'SELECT_ACTION_ITEM',
|};

export function selectActionItem(id: ID) {
  return (dispatch: Dispatch, getState: () => ReduxState) => {
    // NOTE: The transition modal does the work of dispatching the selected
    // action item action once it is presented. The modal also dismisses
    // itself.
    dispatch({
      modal: {
        id: 'HOME_TO_ACTION_ITEM_TRANSITION',
        modalType: 'REACT_WITH_TRANSITION',
        priority: 'SYSTEM_CRITICAL',
        renderIn: () => (
          <HomeToActionItemTransitionModal
            dismissAfterTransitioningOut={true}
            actionItemID={id}
            show={true}
            transitionType="HOME_TO_ACTION_ITEM"
          />
        ),
        renderOut: () => (
          <HomeToActionItemTransitionModal
            dismissAfterTransitioningOut={true}
            actionItemID={id}
            show={false}
            transitionType="HOME_TO_ACTION_ITEM"
          />
        ),
        renderTransitionOut: () => (
          <HomeToActionItemTransitionModal
            dismissAfterTransitioningOut={true}
            actionItemID={id}
            show={false}
            transitionType="HOME_TO_ACTION_ITEM"
          />
        ),
        renderTransitionIn: () => (
          <HomeToActionItemTransitionModal
            dismissAfterTransitioningOut={true}
            actionItemID={id}
            show={true}
            transitionType="HOME_TO_ACTION_ITEM"
          />
        ),
        transitionInMillis: ModalTransitionInMillis,
        transitionOutMillis: ModalTransitionOutMillis,
      },
      shouldIgnoreRequestingExistingModal: false,
      type: 'REQUEST_MODAL',
    });
  };
}

export type Action$UnselectCurrentActionItem = {|
  +type: 'UNSELECT_CURRENT_ACTION_ITEM',
|};

export function unselectCurrentActionItem() {
  return (dispatch: Dispatch, getState: () => ReduxState) => {
    const id = getState().actionItems.selectedID;
    invariant(id, 'Trying to unselect action item when none is selected');
    // NOTE: The transition modal does the work of dispatching the unselect
    // action item action once it is presented. The modal also dismisses
    // itself.
    dispatch({
      modal: {
        id: 'HOME_TO_ACTION_ITEM_TRANSITION',
        modalType: 'REACT_WITH_TRANSITION',
        priority: 'SYSTEM_CRITICAL',
        renderIn: () => (
          <HomeToActionItemTransitionModal
            dismissAfterTransitioningOut={true}
            actionItemID={id}
            show={true}
            transitionType="ACTION_ITEM_TO_HOME"
          />
        ),
        renderOut: () => (
          <HomeToActionItemTransitionModal
            dismissAfterTransitioningOut={true}
            actionItemID={id}
            show={false}
            transitionType="ACTION_ITEM_TO_HOME"
          />
        ),
        renderTransitionOut: () => (
          <HomeToActionItemTransitionModal
            dismissAfterTransitioningOut={true}
            actionItemID={id}
            show={false}
            transitionType="ACTION_ITEM_TO_HOME"
          />
        ),
        renderTransitionIn: () => (
          <HomeToActionItemTransitionModal
            dismissAfterTransitioningOut={true}
            actionItemID={id}
            show={true}
            transitionType="ACTION_ITEM_TO_HOME"
          />
        ),
        transitionInMillis: ModalTransitionInMillis,
        transitionOutMillis: ModalTransitionOutMillis,
      },
      shouldIgnoreRequestingExistingModal: false,
      type: 'REQUEST_MODAL',
    });
  };
}
