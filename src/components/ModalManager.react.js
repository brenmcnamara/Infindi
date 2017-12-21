/* @flow */

import { Component } from 'react';

import { connect } from 'react-redux';

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

class ModalManager extends Component<Props> {
  componentWillReceiveProps(nextProps: Props) {
    console.log(nextProps.mostIportantModal);
    const { mostImportantModal } = this.props;
    const newMostImportantModal = nextProps.mostImportantModal;
    const currentID = mostImportantModal ? mostImportantModal.id : null;
    const newID = newMostImportantModal ? newMostImportantModal.id : null;

    if (currentID !== newID) {
      if (mostImportantModal && mostImportantModal.modalType === 'NATIVE') {
        mostImportantModal.hide();
      }

      if (
        newMostImportantModal &&
        newMostImportantModal.modalType === 'NATIVE'
      ) {
        newMostImportantModal.show();
      }
    }
  }

  render() {
    // TODO: Add JS Modal support.
    return null;
  }
}

function mapReduxStateToProps(state: ReduxState) {
  return {
    mostImportantModal: state.modalState.modalQueue[0] || null,
  };
}

export default connect(mapReduxStateToProps)(ModalManager);
