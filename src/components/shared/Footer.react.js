/* @flow */

import Colors from '../../design/colors';
import React, { Component } from 'react';

import { StyleSheet, View } from 'react-native';

export type Props = {
  children?: ?any,
  // TODO: What is the proper typing for this?
  style?: any,
};

export default class Footer extends Component<Props> {
  render() {
    return (
      <View style={[styles.root, this.props.style]}>{this.props.children}</View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    borderColor: Colors.BORDER,
    borderTopWidth: 1,
    height: 50,
  },
});
