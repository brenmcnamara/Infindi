/* @flow */

import Colors from '../../design/colors';
import React, { Component } from 'react';

import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';

export type Props = {
  avoidKeyboard: bool,
  children?: ?any,
};

export type DefaultProps = {
  avoidKeyboard: bool,
};

export default class Screen extends Component<Props> {
  static defaultProps: DefaultProps = {
    avoidKeyboard: false,
  };

  render() {
    const Component = this.props.avoidKeyboard ? KeyboardAvoidingView : View;
    const keyboardProps = this.props.avoidKeyboard
      ? { behavior: 'padding' }
      : {};
    return (
      <Component {...keyboardProps} style={styles.root}>
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
