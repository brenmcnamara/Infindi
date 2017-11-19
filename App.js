/* @flow */

import Icons from './icons';
import InfindiCore from './src/infindi-core';
import React, { Component } from 'react';

import { Image, StyleSheet, Text, View } from 'react-native';

export default class App extends Component<{}> {
  componentDidMount(): void {
    InfindiCore.initialize();
    InfindiCore.onEvent(console.log);
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={Icons.InfindiLogo} style={styles.logo} />
        <Text style={styles.header}>Infindi</Text>
        <Text style={styles.subHeader}>Coming Soon</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  header: {
    fontFamily: 'Lato-Regular',
    fontSize: 32,
    marginBottom: 40,
    textAlign: 'center',
  },

  logo: {
    marginBottom: 10,
  },

  subHeader: {
    fontFamily: 'Lato-Light',
    fontSize: 18,
    margin: 10,
    textAlign: 'center',
  },
});
