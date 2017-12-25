/* @flow */

import Colors from '../../design/colors';
import React, { Component } from 'react';

import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';

export type Props = {
  avoidKeyboard: bool,
  avoidNavbar: bool,
  children?: ?any,
  theme: 'LIGHT' | 'NORMAL' | 'DARK',
};

export type DefaultProps = {
  avoidKeyboard: bool,
  avoidNavbar: bool,
  avoidTabbar: bool,
  theme: 'LIGHT' | 'NORMAL' | 'DARK',
};

const NAV_BAR_HEIGHT = 44;
const TAB_BAR_HEIGHT = 50;

export default class Screen extends Component<Props> {
  static defaultProps: DefaultProps = {
    avoidNavbar: false,
    avoidKeyboard: false,
    avoidTabBar: false,
    theme: 'NORMAL',
  };

  render() {
    const Component = this.props.avoidKeyboard ? KeyboardAvoidingView : View;
    const keyboardProps = this.props.avoidKeyboard
      ? { behavior: 'padding' }
      : {};
    const rootStyles = [
      styles.root,
      this.props.avoidNavBar ? { paddingTop: NAV_BAR_HEIGHT } : null,
      this.props.avoidTabBar ? { paddingBottom: TAB_BAR_HEIGHT } : null,
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
