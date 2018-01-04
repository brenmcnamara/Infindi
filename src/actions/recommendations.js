/* @flow */

import HomeToRecommendationTransitionModal, {
  TransitionInMillis as ModalTransitionInMillis,
  TransitionOutMillis as ModalTransitionOutMillis,
} from '../components/HomeToRecommendationTransitionModal.react';
import React from 'react';

import invariant from 'invariant';

import type { ID } from 'common/src/types/core';
import type { Dispatch, ReduxState } from '../typesDEPRECATED/redux';

export type Action =
  | Action$DeleteRecommendation
  | Action$FocusedRecommendationChange
  | Action$SelectRecommendation
  | Action$UnselectCurrentRecommendation;

export type Action$FocusedRecommendationChange = {|
  +recommendationID: ID,
  +type: 'FOCUSED_RECOMMENDATION_CHANGE',
|};

export function focusedRecommendationChange(id: ID) {
  return {
    recommendationID: id,
    type: 'FOCUSED_RECOMMENDATION_CHANGE',
  };
}

export type Action$DeleteRecommendation = {|
  +recommendationID: ID,
  +type: 'DELETE_RECOMMENDATION',
|};

export function deleteRecommendation(id: ID) {
  return {
    recommendationID: id,
    type: 'DELETE_RECOMMENDATION',
  };
}

// NOTE: The only way to present a recommendation now is by clicking on the
// card in the dialog. We may need to add support for other transitions in the
// future as we create other mechanisms.

export type Action$SelectRecommendation = {|
  +recommendationID: ID,
  +type: 'SELECT_RECOMMENDATION',
|};

export function selectRecommendation(id: ID) {
  return (dispatch: Dispatch, getState: () => ReduxState) => {
    // NOTE: The transition modal does the work of dispatching the selected
    // recommendation action once it is presented. The modal also dismisses
    // itself.
    dispatch({
      modal: {
        id: 'HOME_TO_RECOMMENDATION_TRANSITION',
        modalType: 'REACT_WITH_TRANSITION',
        priority: 'SYSTEM_CRITICAL',
        renderIn: () => (
          <HomeToRecommendationTransitionModal
            dismissAfterTransitioningOut={true}
            recommendationID={id}
            show={true}
            transitionType="HOME_TO_RECOMMENDATION"
          />
        ),
        renderInitial: () => (
          <HomeToRecommendationTransitionModal
            dismissAfterTransitioningOut={true}
            recommendationID={id}
            show={false}
            transitionType="HOME_TO_RECOMMENDATION"
          />
        ),
        renderTransitionOut: () => (
          <HomeToRecommendationTransitionModal
            dismissAfterTransitioningOut={true}
            recommendationID={id}
            show={false}
            transitionType="HOME_TO_RECOMMENDATION"
          />
        ),
        transitionInMillis: ModalTransitionInMillis,
        transitionOutMillis: ModalTransitionOutMillis,
      },
      type: 'REQUEST_MODAL',
    });
  };
}

export type Action$UnselectCurrentRecommendation = {|
  +type: 'UNSELECT_CURRENT_RECOMMENDATION',
|};

export function unselectCurrentRecommendation() {
  return (dispatch: Dispatch, getState: () => ReduxState) => {
    const id = getState().recommendations.selectedID;
    invariant(id, 'Trying to unselect recommendation when none is selected');
    // NOTE: The transition modal does the work of dispatching the unselect
    // recommendation action once it is presented. The modal also dismisses
    // itself.
    dispatch({
      modal: {
        id: 'HOME_TO_RECOMMENDATION_TRANSITION',
        modalType: 'REACT_WITH_TRANSITION',
        priority: 'SYSTEM_CRITICAL',
        renderIn: () => (
          <HomeToRecommendationTransitionModal
            dismissAfterTransitioningOut={true}
            recommendationID={id}
            show={true}
            transitionType="RECOMMENDATION_TO_HOME"
          />
        ),
        renderInitial: () => (
          <HomeToRecommendationTransitionModal
            dismissAfterTransitioningOut={true}
            recommendationID={id}
            show={false}
            transitionType="RECOMMENDATION_TO_HOME"
          />
        ),
        renderTransitionOut: () => (
          <HomeToRecommendationTransitionModal
            dismissAfterTransitioningOut={true}
            recommendationID={id}
            show={false}
            transitionType="RECOMMENDATION_TO_HOME"
          />
        ),
        transitionInMillis: ModalTransitionInMillis,
        transitionOutMillis: ModalTransitionOutMillis,
      },
      type: 'REQUEST_MODAL',
    });
  };
}
