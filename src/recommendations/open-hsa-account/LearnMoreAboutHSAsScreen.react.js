/* @flow */

import React, { Component } from 'react';

import { StyleSheet, View } from 'react-native';

export type Props = {};

export default class LearnMoreAboutHSAsScreen extends Component<Props> {
  render() {
    return <View style={styles.root} />;
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'blue',
    flex: 1,
  },
});
