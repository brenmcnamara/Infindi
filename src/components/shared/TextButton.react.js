/* @flow */

import React, { Component } from 'react';
import TextDesign from '../../design/text';

import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export type ButtonType = 'PRIMARY' | 'NORMAL' | 'SPECIAL';
export type ButtonSize = 'SMALL' | 'MEDIUM' | 'LARGE';

export type Props = {
  // TODO: Proper typing for this.
  onPress: Function,
  size: 'LARGE' | 'MEDIUM' | 'SMALL',
  text: string,
  type: 'PRIMARY' | 'NORMAL' | 'SPECIAL',
};

export type DefaultProps = {
  size: ButtonSize,
  type: ButtonType,
};

export default class TextButton extends Component<Props> {
  static defaultProps: DefaultProps = {
    size: 'MEDIUM',
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
    return (
      <TouchableOpacity onPress={onPress} style={styles.root}>
        <Text style={buttonStyles}>{text}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  root: {},

  text: {
    padding: 8,
  },
});
