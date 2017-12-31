/* @flow */

import Content from './shared/Content.react';
import Icons from '../design/icons';
import React, { Component } from 'react';
import Screen from './shared/Screen.react';
import TextDesign from '../design/text';

import { connect } from 'react-redux';
import { Image, StyleSheet, Text, View } from 'react-native';
import { NoInternet as NoInternetContent } from '../../content';

class NoInternetScreen extends Component<{}> {
  render() {
    return (
      <Screen>
        <Content>
          <View style={styles.root}>
            <Image
              resizeMode="contain"
              source={Icons.Wifi}
              style={styles.icon}
            />
            <Text style={[styles.text, TextDesign.header3]}>
              {NoInternetContent}
            </Text>
          </View>
        </Content>
      </Screen>
    );
  }
}

export default connect()(NoInternetScreen);

const styles = StyleSheet.create({
  icon: {
    height: 60,
  },

  root: {
    alignItems: 'center',
    flex: 1,
    marginTop: 80,
  },

  text: {
    paddingHorizontal: 16,
    paddingTop: 32,
    textAlign: 'center',
  },
});
