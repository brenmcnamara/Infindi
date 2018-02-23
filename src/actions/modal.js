/* @flow */

/**
 * This module controls the presentation of all modal views.
 */

import InfoModal, {
  TransitionInMillis as InfoModalTransitionInMillis,
  TransitionOutMillis as InfoModalTransitionOutMillis,
} from '../components/shared/InfoModal.react';
import LeftPaneScreen, {
  TransitionInMillis as LeftPaneTransitionInMillis,
  TransitionOutMillis as LeftPaneTransitionOutMillis,
} from '../components/LeftPaneScreen.react';
import React from 'react';
import TextDesign from '../design/text';

import { Text } from 'react-native';

import type { ID } from 'common/types/core';
import type { Modal } from '../reducers/modalState';

export const LeftPaneModalID = 'LEFT_PANE';

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

export function requestInfoModal(
  payload: InfoModalPayload,
): Action$RequestModal {
  return {
    modal: {
      id: payload.id,
      modalType: 'REACT_WITH_TRANSITION',
      priority: 'USER_REQUESTED',
      renderIn: () => (
        <InfoModal modalID={payload.id} show={true} title={payload.title}>
          {payload.render()}
        </InfoModal>
      ),
      renderOut: () => (
        <InfoModal modalID={payload.id} show={false} title={payload.title}>
          {payload.render()}
        </InfoModal>
      ),
      renderTransitionIn: () => (
        <InfoModal modalID={payload.id} show={true} title={payload.title}>
          {payload.render()}
        </InfoModal>
      ),
      renderTransitionOut: () => (
        <InfoModal modalID={payload.id} show={false} title={payload.title}>
          {payload.render()}
        </InfoModal>
      ),
      transitionInMillis: InfoModalTransitionInMillis,
      transitionOutMillis: InfoModalTransitionOutMillis,
    },
    type: 'REQUEST_MODAL',
  };
}

export function requestLeftPane(): Action$RequestModal {
  return {
    modal: {
      id: LeftPaneModalID,
      modalType: 'REACT_WITH_TRANSITION',
      priority: 'USER_REQUESTED',
      renderIn: () => <LeftPaneScreen show={true} />,
      renderOut: () => <LeftPaneScreen show={false} />,
      renderTransitionIn: () => <LeftPaneScreen show={true} />,
      renderTransitionOut: () => <LeftPaneScreen show={false} />,
      transitionInMillis: LeftPaneTransitionInMillis,
      transitionOutMillis: LeftPaneTransitionOutMillis,
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

export function requestUnimplementedModal(
  featureName: string,
): Action$RequestModal {
  return requestInfoModal({
    id: `IMPLEMENT_ME(${featureName})`,
    render: () => (
      <Text style={TextDesign.normal}>
        This feature is not yet implemented, but should be ready soon! Thanks
        for your patience!
      </Text>
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
