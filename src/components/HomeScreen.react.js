/* @flow */

import ActionItemPager from './ActionItemPager.react';
import BannerManager from './shared/BannerManager.react';
import Content from './shared/Content.react';
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
          <View>
            <ActionItemPager />
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
});

export default connect()(HomeScreen);
