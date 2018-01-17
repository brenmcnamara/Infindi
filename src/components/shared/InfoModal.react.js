/* @flow */

import Colors from '../../design/colors';
import ModalTransition, {
  TransitionInMillis as ModalTransitionInMillis,
  TransitionOutMillis as ModalTransitionOutMillis,
} from './ModalTransition.react';
import React, { Component } from 'react';
import TextButton from './TextButton.react';
import TextDesign from '../../design/text';

import { connect } from 'react-redux';
import { dismissModal } from '../../actions/modal';
import { StyleSheet, Text, View } from 'react-native';

import type { ID } from 'common/types/core';
import type { ReduxProps } from '../../typesDEPRECATED/redux';

export type Props = ReduxProps & {
  children?: ?any,
  modalID: ID,
  show: bool,
  title: string,
};

export const TransitionInMillis = ModalTransitionInMillis;
export const TransitionOutMillis = ModalTransitionOutMillis;

/**
 * Modal view designed for an info element.
 */
class InfoModal extends Component<Props> {
  render() {
    return (
      <ModalTransition
        onPressBackground={this._onPressBackground}
        show={this.props.show}
      >
        <View style={styles.root}>
          <View style={styles.header}>
            <Text style={TextDesign.normalWithEmphasis}>
              {this.props.title}
            </Text>
          </View>
          <View style={styles.content}>{this.props.children}</View>
          <View style={styles.buttonContainer}>
            <TextButton
              layoutType="FILL_PARENT"
              onPress={this._onPressDismiss}
              size="SMALL"
              text="Got it!"
              type="PRIMARY"
            />
          </View>
        </View>
      </ModalTransition>
    );
  }

  _onPressBackground = (): void => {
    this.props.dispatch(dismissModal(this.props.modalID));
  };

  _onPressDismiss = (): void => {
    this.props.dispatch(dismissModal(this.props.modalID));
  };
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderColor: Colors.BORDER,
    borderTopWidth: 1,
    height: 40,
  },
  content: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },

  header: {
    paddingHorizontal: 8,
    paddingTop: 16,
  },

  root: {
    backgroundColor: Colors.BACKGROUND,
    borderColor: Colors.BORDER,
    borderRadius: 2,
    borderWidth: 1,
    marginHorizontal: 8,
  },
});

export default connect()(InfoModal);
