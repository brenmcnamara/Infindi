/* @flow */

import React, { Component } from 'react';
import Themes from '../../design/themes';

import { NavBarHeight, TabBarHeight } from '../../design/layout';
import { StyleSheet, View } from 'react-native';

export type Props = {
  avoidKeyboard: boolean,
  avoidNavbar: boolean,
  children?: ?any,
};

export type DefaultProps = {
  avoidKeyboard: boolean,
  avoidNavbar: boolean,
  avoidTabBar: boolean,
};

export default class Screen extends Component<Props> {
  static defaultProps: DefaultProps = {
    avoidNavbar: false,
    avoidKeyboard: false,
    avoidTabBar: false,
  };

  render() {
    const theme = Themes.primary;
    const rootStyles = [
      styles.root,
      this.props.avoidNavBar ? { paddingTop: NavBarHeight } : null,
      this.props.avoidTabBar ? { paddingBottom: TabBarHeight } : null,
      { backgroundColor: theme.color.backgroundApp },
    ];
    return <View style={rootStyles}>{this.props.children}</View>;
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
