/* @flow */

import React, { Component } from 'react';
import TextDesign from '../../design/text';

import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export type ButtonType = 'PRIMARY' | 'NORMAL' | 'SPECIAL';
export type ButtonSize = 'SMALL' | 'MEDIUM' | 'LARGE';

export type Props = {
  // TODO: Proper typing for this.
  onPress: () => any,
  shouldFillParent: bool,
  size: 'LARGE' | 'MEDIUM' | 'SMALL',
  text: string,
  type: 'PRIMARY' | 'NORMAL' | 'SPECIAL',
};

export type DefaultProps = {
  size: ButtonSize,
  shouldFillParent: bool,
  type: ButtonType,
};

export default class TextButton extends Component<Props> {
  static defaultProps: DefaultProps = {
    size: 'MEDIUM',
    shouldFillParent: false,
    type: 'NORMAL',
  };

  render() {
    const { onPress, size, text, type } = this.props;
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
      <TouchableOpacity onPress={onPress} style={rootStyles}>
        <Text style={buttonStyles}>{text}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  root: {},

  text: {
    textAlign: 'center',
    padding: 8,
  },
});
