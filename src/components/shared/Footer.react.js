/* @flow */

import React, { Component } from 'react';
import Themes from '../../design/themes';

import { StyleSheet, View } from 'react-native';

export type Props = {
  children?: ?any,
  // TODO: What is the proper typing for this?
  style?: any,
};

export default class Footer extends Component<Props> {
  render() {
    const theme = Themes.primary;
    return (
      <View
        style={[
          styles.root,
          { borderColor: theme.color.borderNormal },
          this.props.style,
        ]}
      >
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    borderTopWidth: 1,
    height: 50,
  },
});
