/* @flow */

import If from './shared/If.react';
import React, { Component } from 'react';

import invariant from 'invariant';
import nullthrows from 'nullthrows';

import { connect } from 'react-redux';
import { Modal, Modal$React } from 'react-native';

import type { ReduxState } from '../typesDEPRECATED/redux';

/**
 * This component is in charge of displaying all modals that exist in Infindi.
 * If the modal is a native modal, this module will perform the necessary
 * side effects to display and manage that modal. If the modal is a JS modal
 * it will render the modal in react.
 */
export type Props = ReduxProps & {
  mostImportantModal: Modal | null,
};

type State = {
  incomingReactModal: Modal$React | null,
  outgoingReactModal: Modal$React | null,
  shoulTransitionOut: bool,
};

class ModalManager extends Component<Props, State> {
  _transitionTimeout: ?number = null;

  state: State = {
    incomingReactModal: null,
    outgoingReactModal: null,
    transitionState: 'NO_TRANSITION',
  };

  componentWillMount(): void {
    const { mostImportantModal } = this.props;
    if (mostImportantModal && mostImportantModal.modalType === 'REACT') {
      this.setState({
        incomingReactModal: mostImportantModal,
        shouldTransitionOut: false,
      });
    }
  }

  componentWillUnmount(): void {
    clearTimeout(this._transitionTimeout);
    this._transitionTimeout = null;
  }

  componentWillReceiveProps(nextProps: Props) {
    const { mostImportantModal } = this.props;
    const newMostImportantModal = nextProps.mostImportantModal;
    const currentID = mostImportantModal ? mostImportantModal.id : null;
    const newID = newMostImportantModal ? newMostImportantModal.id : null;

    if (currentID !== newID) {
      if (isNativeModal(mostImportantModal)) {
        mostImportantModal.hide();
      }

      if (isNativeModal(newMostImportantModal)) {
        newMostImportantModal.show();
      }

      // Need to handle the cases where we are either adding or removing a
      // react modal.
      let incomingReactModal: ?ModalReact = null;
      let outgoingReactModal: ?Modal$React = null;
      let transitionState = 'NO_TRANSITION';
      let willChangeState = false;

      if (isReactModalThatCanTransitionOut(mostImportantModal)) {
        transitionState = 'TRANSITION_OUT';
      }
      if (isReactModal(mostImportantModal)) {
        outgoingReactModal = castToReactModal(mostImportantModal);
        willChangeState = true;
      }
      if (isReactModal(newMostImportantModal)) {
        incomingReactModal = castToReactModal(newMostImportantModal);
        willChangeState = true;
      }

      if (willChangeState) {
        this.setState({
          incomingReactModal,
          outgoingReactModal,
          transitionState,
        });

        if (transitionState === 'TRANSITION_OUT') {
          // After we are done transitioning out, we need to remove the outgoing
          // modal view.
          invariant(
            outgoingReactModal && outgoingReactModal.transitionOutMillis,
            'Error with modal %s: A react modal with a renderTransitionOut() ' +
              'property defined must also define transitionOutMillis',
          );
          this._transitionTimeout = setTimeout(() => {
            this.setState({
              outgoingReactModal: null,
              transitionState: 'NO_TRANSITION',
            });
          }, outgoingReactModal.transitionOutMillis);
        }
      }
    }
  }

  render() {
    return (
      <Modal animationType="none" show={true} transparent={true}>
        {this._renderTransitionIn()}
        {this._renderTransitionOut()}
      </Modal>
    );
  }

  _renderTransitionIn() {
    const { incomingReactModal } = this.state;
    if (!incomingReactModal) {
      return null;
    }
    return (
      <AddKey key={incomingReactModal.id}>{incomingReactModal.render()}</AddKey>
    );
  }

  _renderTransitionOut() {
    const { outgoingReactModal, shouldTransitionOut } = this.state;
    if (!outgoingReactModal || !shouldTransitionOut) {
      return null;
    }
    invariant(
      outgoingReactModal.renderTransitionOut,
      'Internal error for modal manager',
    );
    return (
      <AddKey key={outgoingReactModal.id}>
        {outgoingReactModal.renderTransitionOut()}
      </AddKey>
    );
  }
}

function mapReduxStateToProps(state: ReduxState) {
  return {
    mostImportantModal: state.modalState.modalQueue[0] || null,
  };
}

function isNativeModal(modal: ?Modal): bool {
  return Boolean(modal && modal.modalType === 'NATIVE');
}

function isReactModal(modal: ?Modal): bool {
  return Boolean(modal && modal.modalType === 'REACT');
}

function isReactModalThatCanTransitionOut(modal: ?Modal): bool {
  return Boolean(
    modal && modal.modalType === 'REACT' && modal.renderTransitionOut,
  );
}

function castToReactModal(modal: ?Modal): Modal$React {
  invariant(
    modal && modal.modalType === 'REACT',
    'Expected modal to be a react modal',
  );
  return modal;
}

class AddKey extends Component<{ children?: ?any }> {
  render() {
    const child = React.Children.only(this.props.children);
    return child;
  }
}

export default connect(mapReduxStateToProps)(ModalManager);
