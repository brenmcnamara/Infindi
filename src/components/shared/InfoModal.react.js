/* @flow */

import ModalTransition, {
  TransitionInMillis as ModalTransitionInMillis,
  TransitionOutMillis as ModalTransitionOutMillis,
} from './ModalTransition.react';
import React, { Component } from 'react';
import TextButton from './TextButton.react';

import { connect } from 'react-redux';
import { dismissModal } from '../../actions/modal';
import { GetTheme } from '../../design/components/Theme.react';
import { StyleSheet, Text, View } from 'react-native';

import type { ID } from 'common/types/core';
import type { ReduxProps } from '../../store';

export type Props = ReduxProps & {
  children?: ?any,
  modalID: ID,
  title: string,
  transitionStage: 'TRANSITION_IN' | 'TRANSITION_OUT' | 'IN' | 'OUT',
};

export const TransitionInMillis = ModalTransitionInMillis;
export const TransitionOutMillis = ModalTransitionOutMillis;

/**
 * Modal view designed for an info element.
 */
class InfoModal extends Component<Props> {
  render() {
    return (
      <GetTheme>
        {theme => (
          <ModalTransition
            onPressBackground={this._onPressBackground}
            show={
              this.props.transitionStage === 'IN' ||
              this.props.transitionStage === 'TRANSITION_IN'
            }
          >
            <View
              style={[
                styles.root,
                {
                  backgroundColor: theme.color.backgroundMain,
                  borderColor: theme.color.borderNormal,
                },
              ]}
            >
              <View style={styles.header}>
                <Text style={theme.getTextStyleNormalWithEmphasis()}>
                  {this.props.title}
                </Text>
              </View>
              <View style={styles.content}>{this.props.children}</View>
              <View
                style={[
                  styles.buttonContainer,
                  { borderColor: theme.color.borderNormal },
                ]}
              >
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
        )}
      </GetTheme>
    );
  }

  _onPressBackground = (): void => {
    this.props.dispatch(dismissModal(this.props.modalID));
  };

  _onPressDismiss = (): void => {
    this.props.transitionStage === 'IN' &&
      this.props.dispatch(dismissModal(this.props.modalID));
  };
}

const styles = StyleSheet.create({
  buttonContainer: {
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
    borderRadius: 2,
    borderWidth: 1,
    marginHorizontal: 8,
  },
});

export default connect()(InfoModal);
