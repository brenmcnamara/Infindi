/* @flow */

import Content from '../components/shared/Content.react';
import React, { Component } from 'react';
import Screen from '../components/shared/Screen.react';

import { ActivityIndicator, StyleSheet, View } from 'react-native';

export type Props = {};

/**
 * This screen indicates loading the app state and authentication
 * state of the user.
 */
export default class LoadingScreen extends Component<Props> {
  render() {
    return (
      <Screen>
        <Content>
          <View style={styles.centerContent}>
            <ActivityIndicator size="small" />
          </View>
        </Content>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  centerContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
