/* @flow */

import React, { Component } from 'react';

import { GetTheme } from '../../design/components/Theme.react';
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
    return (
      <GetTheme>
        {theme => (
          <View
            style={[
              styles.root,
              this.props.avoidNavBar ? { paddingTop: NavBarHeight } : null,
              this.props.avoidTabBar ? { paddingBottom: TabBarHeight } : null,
              { backgroundColor: theme.color.backgroundMain },
            ]}
          >
            {this.props.children}
          </View>
        )}
      </GetTheme>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
