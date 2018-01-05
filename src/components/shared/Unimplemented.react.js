/* @flow */

import Colors from '../../design/colors';
import Icons from '../../design/icons';
import React, { Component } from 'react';

import { Image, StyleSheet, Text, View } from 'react-native';

export default class HomeScreen extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Image source={Icons.InfindiLogo} style={styles.logo} />
        <Text style={styles.header}>Coming Soon</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.BACKGROUND,
    flex: 1,
    paddingTop: 40,
  },

  header: {
    fontFamily: 'Lato-Regular',
    fontSize: 24,
    textAlign: 'center',
  },

  logo: {
    marginBottom: 40,
  },
});
