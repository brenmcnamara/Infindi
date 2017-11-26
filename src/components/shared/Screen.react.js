/* @flow */

import Colors from '../../design/colors';
import React, { Component } from 'react';

import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';

export type Props = {
  avoidKeyboard: bool,
  children?: ?any,
  theme: 'LIGHT' | 'NORMAL' | 'DARK',
};

export type DefaultProps = {
  avoidKeyboard: bool,
  theme: 'LIGHT' | 'NORMAL' | 'DARK',
};

export default class Screen extends Component<Props> {
  static defaultProps: DefaultProps = {
    avoidKeyboard: false,
    theme: 'NORMAL',
  };

  render() {
    const Component = this.props.avoidKeyboard ? KeyboardAvoidingView : View;
    const keyboardProps = this.props.avoidKeyboard
      ? { behavior: 'padding' }
      : {};
    const rootStyles = [
      styles.root,
      {
        backgroundColor:
          this.props.theme === 'NORMAL'
            ? Colors.BACKGROUND
            : Colors.BACKGROUND_LIGHT,
      },
    ];
    return (
      <Component {...keyboardProps} style={rootStyles}>
        {this.props.children}
      </Component>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.BACKGROUND,
    flex: 1,
  },
});
