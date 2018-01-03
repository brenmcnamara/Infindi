/* @flow */

import React, { Component } from 'react';
import TextDesign from '../../design/text';

import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export type ButtonType = 'PRIMARY' | 'NORMAL' | 'SPECIAL';
export type ButtonSize = 'SMALL' | 'MEDIUM' | 'LARGE';

export type Props = {
  // TODO: Change this to "isEnabled"
  isDisabled: bool,
  onPress: () => any,
  shouldFillParent: bool,
  size: 'LARGE' | 'MEDIUM' | 'SMALL',
  text: string,
  type: 'PRIMARY' | 'NORMAL' | 'SPECIAL',
};

export type DefaultProps = {
  isDisabled: bool,
  size: ButtonSize,
  shouldFillParent: bool,
  type: ButtonType,
};

export default class TextButton extends Component<Props> {
  static defaultProps: DefaultProps = {
    isDisabled: false,
    size: 'MEDIUM',
    shouldFillParent: false,
    type: 'NORMAL',
  };

  render() {
    const { size, text, type } = this.props;
    const buttonStyles = [
      styles.text,
      {
        fontSize:
          size === 'LARGE'
            ? TextDesign.largeFontSize
            : size === 'SMALL'
              ? TextDesign.smallFontSize
              : TextDesign.mediumFontSize,
      },
      type === 'PRIMARY'
        ? TextDesign.primaryButton
        : type === 'SPECIAL'
          ? TextDesign.specialButton
          : TextDesign.normalButton,
    ];
    const rootStyles = [
      styles.root,
      this.props.shouldFillParent
        ? {
            alignSelf: 'stretch',
            flex: 1,
            justifyContent: 'center',
          }
        : null,
    ];
    return (
      <TouchableOpacity
        activeOpacity={this.props.isDisabled ? 1.0 : 0.2}
        onPress={this._onPress}
        style={rootStyles}
      >
        <Text style={buttonStyles}>{text}</Text>
      </TouchableOpacity>
    );
  }

  _onPress = (): void => {
    if (!this.props.isDisabled) {
      this.props.onPress();
    }
  };
}

const styles = StyleSheet.create({
  root: {},

  text: {
    textAlign: 'center',
    padding: 8,
  },
});
