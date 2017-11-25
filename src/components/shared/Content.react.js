/* @flow */

import React, { Component } from 'react';

import { StyleSheet, View } from 'react-native';

export type Props = {
  children?: ?any,
};

export default class Content extends Component<Props> {
  render() {
    return <View style={styles.root}>{this.props.children}</View>;
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
