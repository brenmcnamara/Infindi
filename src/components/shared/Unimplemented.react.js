/* @flow */

import Icons from '../../design/icons';
import React, { Component } from 'react';

import { GetTheme } from '../../design/components/Theme.react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default class HomeScreen extends Component<{}> {
  render() {
    return (
      <GetTheme>
        {theme => (
          <View
            style={[
              styles.container,
              { backgroundColor: theme.color.backgroundApp },
            ]}
          >
            <Image source={Icons.InfindiLogo} style={styles.logo} />
            <Text style={styles.header}>Coming Soon</Text>
          </View>
        )}
      </GetTheme>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
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
