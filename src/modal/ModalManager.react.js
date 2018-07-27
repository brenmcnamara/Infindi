/* @flow */

import React, { Component, Fragment } from 'react';

import invariant from 'invariant';

import { connect } from 'react-redux';
import { Modal as ModalView } from 'react-native';

import type {
  Modal,
  Modal$Native,
  Modal$ReactWithTransition,
  TransitionStage,
} from '../modal/types';
import type { ReduxProps, ReduxState } from '../store';

/**
 * This component is in charge of displaying all modals that exist in Infindi.
 * If the modal is a native modal, this module will perform the necessary
 * side effects to display and manage that modal. If the modal is a JS modal
 * it will render the modal in react.
 */
export type Props = ReduxProps & {
  mostImportantModal: Modal | null,
};

// Manages transitioning in and out react modals.
type TransitionState = {|
  +modal: Modal$ReactWithTransition,
  +type: TransitionStage,
|} | null;

// TODO: Instead of nullable transition state, add support for transition state
// that has empty transition. Look at BannerManager for example.
type State = {
  transitionState: TransitionState | null,
};

class ModalManager extends Component<Props, State> {
  _timeoutIDs: Array<TimeoutID> = [];

  constructor(props: Props) {
    super(props);
    const { mostImportantModal } = props;
    if (
      mostImportantModal &&
      mostImportantModal.modalType === 'REACT_WITH_TRANSITION'
    ) {
      this.state = {
        transitionState: {
          modal: mostImportantModal,
          type: 'IN',
        },
      };
    } else {
      this.state = { transitionState: null };
    }
  }

  componentWillUnmount(): void {
    this._timeoutIDs.forEach(id => {
      clearTimeout(id);
    });
    this._timeoutIDs = [];
  }

  componentWillReceiveProps(nextProps: Props): void {
    const { mostImportantModal } = this.props;
    const newMostImportantModal = nextProps.mostImportantModal;
    const currentID = mostImportantModal ? mostImportantModal.id : null;
    const newID = newMostImportantModal ? newMostImportantModal.id : null;

    if (currentID !== newID) {
      if (isNativeModal(mostImportantModal)) {
        castToNativeModal(mostImportantModal).hide();
      }

      if (isNativeModal(newMostImportantModal)) {
        castToNativeModal(newMostImportantModal).show();
      }

      if (
        !isReactWithTransitionModal(mostImportantModal) &&
        isReactWithTransitionModal(newMostImportantModal)
      ) {
        const modal = castToReactWithTransitionModal(newMostImportantModal);
        this._transitionInModal(modal);
      } else if (
        isReactWithTransitionModal(mostImportantModal) &&
        !isReactWithTransitionModal(newMostImportantModal)
      ) {
        const modal = castToReactWithTransitionModal(mostImportantModal);
        this._transitionOutModal(modal);
      } else if (
        isReactWithTransitionModal(mostImportantModal) &&
        isReactWithTransitionModal(newMostImportantModal)
      ) {
        const inModal = castToReactWithTransitionModal(newMostImportantModal);
        const outModal = castToReactWithTransitionModal(mostImportantModal);
        this._transitionOutModal(outModal, false).then(() =>
          this._transitionInModal(inModal),
        );
      }
    }
  }

  render() {
    const { transitionState } = this.state;
    if (!transitionState) {
      return null;
    }

    let content = null;
    switch (transitionState.type) {
      case 'IN':
        content = transitionState.modal.renderIn();
        break;

      case 'OUT':
        content = transitionState.modal.renderOut();
        break;

      case 'TRANSITION_IN':
        content = transitionState.modal.renderTransitionIn();
        break;

      case 'TRANSITION_OUT':
        content = transitionState.modal.renderTransitionOut();
        break;

      default:
        invariant(
          false,
          'Unrecognized transition state: %s',
          transitionState.type,
        );
    }
    return (
      <ModalView animationType="none" transparent={true} visible={true}>
        {transitionState.type !== 'OUT' && (
          <Fragment key={transitionState.modal.id}>{content}</Fragment>
        )}
      </ModalView>
    );
  }

  _transitionInModal(modal: Modal$ReactWithTransition): Promise<void> {
    return new Promise(resolve => {
      this.setState({ transitionState: { modal, type: 'OUT' } }, () => {
        this.setState({ transitionState: { modal, type: 'TRANSITION_IN' } });

        const timeoutID = setTimeout(() => {
          const index = this._timeoutIDs.indexOf(timeoutID);
          if (index >= 0) {
            this._timeoutIDs.splice(index, 1);
          }

          this.setState({ transitionState: { modal, type: 'IN' } }, resolve);
        }, modal.transitionInMillis);

        this._timeoutIDs.push(timeoutID);
      });
    });
  }

  _transitionOutModal(
    modal: Modal$ReactWithTransition,
    shouldTransitionToNull: boolean = true,
  ): Promise<void> {
    return new Promise(resolve => {
      this.setState({
        transitionState: { modal, type: 'TRANSITION_OUT' },
      });
      const timeoutID = setTimeout(() => {
        const index = this._timeoutIDs.indexOf(timeoutID);
        if (index >= 0) {
          this._timeoutIDs.splice(index, 1);
        }

        this.setState({ transitionState: { modal, type: 'OUT' } }, () => {
          if (shouldTransitionToNull) {
            this.setState({ transitionState: null }, resolve);
          } else {
            resolve();
          }
        });
      }, modal.transitionOutMillis);
      this._timeoutIDs.push(timeoutID);
    });
  }
}

// -----------------------------------------------------------------------------
//
// REDUX CONNECTION
//
// -----------------------------------------------------------------------------

function mapReduxStateToProps(state: ReduxState) {
  return {
    mostImportantModal: state.modal.modalQueue[0] || null,
  };
}

export default connect(mapReduxStateToProps)(ModalManager);

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

function isNativeModal(modal: ?Modal): boolean {
  return Boolean(modal && modal.modalType === 'NATIVE');
}

function isReactWithTransitionModal(modal: ?Modal): boolean {
  return Boolean(modal && modal.modalType === 'REACT_WITH_TRANSITION');
}

function castToReactWithTransitionModal(
  modal: Modal | null,
): Modal$ReactWithTransition {
  invariant(
    modal && modal.modalType === 'REACT_WITH_TRANSITION',
    'Failed to cast modal to REACT_WITH_TRANSITION modal: %s',
    modal ? modal.id : '(null)',
  );
  return modal;
}

function castToNativeModal(modal: Modal | null): Modal$Native {
  invariant(
    modal && modal.modalType === 'NATIVE',
    'Failed to cast modal to NATIVE modal: %s',
    modal ? modal.id : '(null)',
  );
  return modal;
}