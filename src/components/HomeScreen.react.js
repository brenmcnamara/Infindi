/* @flow */

import BannerManager from './shared/BannerManager.react';
import Content from './shared/Content.react';
import RecommendationPager from './RecommendationPager.react';
import React, { Component } from 'react';
import Screen from './shared/Screen.react';

import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';

import { type ReduxProps } from 'redux';

export type Props = ReduxProps;

class HomeScreen extends Component<Props> {
  render() {
    return (
      <Screen avoidNavBar={true} avoidTabBar={true}>
        <Content>
          <BannerManager channels={['CORE']} managerKey="HOME" />
          <View style={styles.placeholder} />
          <View style={styles.recommendationContainer}>
            <RecommendationPager />
          </View>
        </Content>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
  },

  recommendationContainer: {},
});

export default connect()(HomeScreen);
