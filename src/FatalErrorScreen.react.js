/* @flow */

import Content from './shared/components/Content.react';
import Icons from './design/icons';
import React, { Component } from 'react';
import Screen from './shared/components/Screen.react';
import TextDesign from './design/text';

import { connect } from 'react-redux';
import { FatalError as FatalErrorContent } from '../content';
import { Image, StyleSheet, Text, View } from 'react-native';

class FatalErrorScreen extends Component<{}> {
  render() {
    return (
      <Screen>
        <Content>
          <View style={styles.root}>
            <Image source={Icons.ErrorLarge} />
            <Text style={[styles.text, TextDesign.header3]}>
              {FatalErrorContent}
            </Text>
          </View>
        </Content>
      </Screen>
    );
  }
}

export default connect()(FatalErrorScreen);

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
