/* @flow */

import Colors from '../design/colors';
import Icons from '../design/icons';
import React, { Component } from 'react';

import { Image, StyleSheet, View } from 'react-native';

export type Props = {};

export default class LoadingScreen extends Component<Props> {
  render() {
    return (
      <View style={styles.root}>
        <Image source={Icons.InfindiLogoSplash} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    backgroundColor: Colors.BACKGROUND,
    flex: 1,
    justifyContent: 'center',
  },
});
