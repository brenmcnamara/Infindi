/* @flow */

import Colors from '../../design/colors';
import React, { Component } from 'react';

import { StyleSheet, View } from 'react-native';

import type { RecommendationComponentProps } from '..';

export default class OpenHSAAccount extends Component<
  RecommendationComponentProps,
> {
  render() {
    return <View style={styles.root} />;
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'red', // Colors.BACKGROUND,
    flex: 1,
  },
});
