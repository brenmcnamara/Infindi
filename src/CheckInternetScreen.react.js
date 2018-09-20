/* @flow */

import * as React from 'react';
import Content from './shared/components/Content.react';
import Icons from './design/icons';
import Screen from './shared/components/Screen.react';
import TextDesign from './design/text';

import { CheckInternet } from '../content';
import { Image, StyleSheet, Text, View } from 'react-native';

export type Props = {};

export default class CheckInternetScreen extends React.Component<Props> {
  render() {
    return (
      <Screen>
        <Content>
          <View style={styles.root}>
            <Image source={Icons.ErrorLarge} />
            <Text style={[styles.text, TextDesign.header3]}>
              {CheckInternet}
            </Text>
          </View>
        </Content>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    flex: 1,
    marginTop: 140,
  },

  text: {
    paddingHorizontal: 40,
    paddingTop: 60,
    textAlign: 'center',
  },
});
