/* @flow */

/**
 * This module controls the presentation of all modal views.
 */

import InfoModal, {
  TransitionInMillis as InfoModalTransitionInMillis,
  TransitionOutMillis as InfoModalTransitionOutMillis,
} from './InfoModal.react';
import LeftPaneScreen, {
  TransitionInMillis as LeftPaneTransitionInMillis,
  TransitionOutMillis as LeftPaneTransitionOutMillis,
} from '../LeftPaneScreen.react';
import React from 'react';
import RightPaneScreen, {
  TransitionInMillis as RightPaneTransitionInMillis,
  TransitionOutMillis as RightPaneTransitionOutMillis,
} from '../RightPaneScreen.react';

import { GetTheme } from '../design/components/Theme.react';
import { Text } from 'react-native';

import type { GetState, PureDispatch } from '../store';
import type { ID } from 'common/types/core';
import type { Modal } from '../modal/types';

export const LeftPaneModalID = 'LEFT_PANE';
export const RightPaneModalID = 'RIGHT_PANE';

export type Action = Action$DismissModal | Action$RequestModal;

export type Action$DismissModal = {|
  +modalID: ID,
  +type: 'DISMISS_MODAL',
|};

export type Action$RequestModal = {|
  +modal: Modal,
  +type: 'REQUEST_MODAL',
|};

export type InfoModalPayload = {
  id: ID,
  render: () => React$Element<*>,
  title: string,
};

// TODO: Need to move application-specific modal calls out somewhere else.

export function requestInfoModal(payload: InfoModalPayload) {
  return (dispatch: PureDispatch, getState: GetState) => {
    const alreadyHasInfoModal = getState().modal.modalQueue.some(
      modal => modal.id === payload.id,
    );
    if (alreadyHasInfoModal) {
      return;
    }

    dispatch({
      modal: {
        id: payload.id,
        modalType: 'REACT_WITH_TRANSITION',
        priority: 'USER_REQUESTED',
        renderIn: () => (
          <InfoModal
            modalID={payload.id}
            title={payload.title}
            transitionStage="IN"
          >
            {payload.render()}
          </InfoModal>
        ),
        renderOut: () => (
          <InfoModal
            modalID={payload.id}
            title={payload.title}
            transitionStage="OUT"
          >
            {payload.render()}
          </InfoModal>
        ),
        renderTransitionIn: () => (
          <InfoModal
            modalID={payload.id}
            title={payload.title}
            transitionStage="TRANSITION_IN"
          >
            {payload.render()}
          </InfoModal>
        ),
        renderTransitionOut: () => (
          <InfoModal
            modalID={payload.id}
            title={payload.title}
            transitionStage="TRANSITION_OUT"
          >
            {payload.render()}
          </InfoModal>
        ),
        transitionInMillis: InfoModalTransitionInMillis,
        transitionOutMillis: InfoModalTransitionOutMillis,
      },
      type: 'REQUEST_MODAL',
    });
  };
}

export function requestLeftPane(): Action$RequestModal {
  return {
    modal: {
      id: LeftPaneModalID,
      modalType: 'REACT_WITH_TRANSITION',
      priority: 'USER_REQUESTED',
      renderIn: () => <LeftPaneScreen animateOnMount={true} show={true} />,
      renderOut: () => <LeftPaneScreen animateOnMount={true} show={false} />,
      renderTransitionIn: () => (
        <LeftPaneScreen animateOnMount={true} show={true} />
      ),
      renderTransitionOut: () => (
        <LeftPaneScreen animateOnMount={true} show={false} />
      ),
      transitionInMillis: LeftPaneTransitionInMillis,
      transitionOutMillis: LeftPaneTransitionOutMillis,
    },
    type: 'REQUEST_MODAL',
  };
}

export function requestRightPane(): Action$RequestModal {
  return {
    modal: {
      id: RightPaneModalID,
      modalType: 'REACT_WITH_TRANSITION',
      priority: 'USER_REQUESTED',
      renderIn: () => <RightPaneScreen animateOnMount={true} show={true} />,
      renderOut: () => <RightPaneScreen animateOnMount={true} show={false} />,
      renderTransitionIn: () => (
        <RightPaneScreen animateOnMount={true} show={true} />
      ),
      renderTransitionOut: () => (
        <RightPaneScreen animateOnMount={true} show={false} />
      ),
      transitionInMillis: RightPaneTransitionInMillis,
      transitionOutMillis: RightPaneTransitionOutMillis,
    },
    type: 'REQUEST_MODAL',
  };
}

export function dismissLeftPane(): Action$DismissModal {
  return {
    modalID: LeftPaneModalID,
    type: 'DISMISS_MODAL',
  };
}

export function requestUnimplementedModal(featureName: string) {
  return requestInfoModal({
    id: `IMPLEMENT_ME(${featureName})`,
    render: () => (
      <GetTheme>
        {theme => (
          <Text style={theme.getTextStyleNormal()}>
            This feature is not yet implemented, but should be ready soon!
            Thanks for your patience!
          </Text>
        )}
      </GetTheme>
    ),
    title: featureName,
  });
}

export function dismissModal(modalID: ID): Action$DismissModal {
  return {
    modalID,
    type: 'DISMISS_MODAL',
  };
}