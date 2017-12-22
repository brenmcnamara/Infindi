/* @flow */

/**
 * This module controls the presentation of all modal views.
 */

import InfoModal, {
  TransitionInMillis,
  TransitionOutMillis,
} from '../components/shared/InfoModal.react';
import React from 'react';
import TextDesign from '../design/text';

import { Text } from 'react-native';

import type { ID } from 'common/src/types/core';
import type { Modal } from '../reducers/modalState';

export type Action = Action$HideModal | Action$ShowModal;

export type Action$DismissModal = {|
  +modalID: ID,
  +type: 'HIDE_MODAL',
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

export function requestInfoModal(payload: InfoModalPayload) {
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
      renderInitial: () => (
        <InfoModal modalID={payload.id} show={false} title={payload.title}>
          {payload.render()}
        </InfoModal>
      ),
      renderTransitionOut: () => (
        <InfoModal modalID={payload.id} show={false} title={payload.title}>
          {payload.render()}
        </InfoModal>
      ),
      transitionInMillis: TransitionInMillis,
      transitionOutMillis: TransitionOutMillis,
    },
    type: 'REQUEST_MODAL',
  };
}

export function requestUnimplementedModal(featureName: string) {
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

export function dismissModal(modalID: ID) {
  return {
    modalID,
    type: 'DISMISS_MODAL',
  };
}
