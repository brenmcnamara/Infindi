/* @flow */

import Colors from '../../design/colors';
import React, { Component } from 'react';

import { NavBarHeight, TabBarHeight } from '../../design/layout';
import { StyleSheet, View } from 'react-native';

export type Props = {
  avoidKeyboard: bool,
  avoidNavbar: bool,
  children?: ?any,
  theme: 'LIGHT' | 'NORMAL' | 'DARK',
};

export type DefaultProps = {
  avoidKeyboard: bool,
  avoidNavbar: bool,
  avoidTabBar: bool,
  theme: 'LIGHT' | 'NORMAL' | 'DARK',
};

export default class Screen extends Component<Props> {
  static defaultProps: DefaultProps = {
    avoidNavbar: false,
    avoidKeyboard: false,
    avoidTabBar: false,
    theme: 'NORMAL',
  };

  render() {
    const rootStyles = [
      styles.root,
      this.props.avoidNavBar ? { paddingTop: NavBarHeight } : null,
      this.props.avoidTabBar ? { paddingBottom: TabBarHeight } : null,
      {
        backgroundColor:
          this.props.theme === 'NORMAL'
            ? Colors.BACKGROUND
            : Colors.BACKGROUND_LIGHT,
      },
    ];
    return <View style={rootStyles}>{this.props.children}</View>;
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
