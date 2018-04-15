/* @flow */

import If from './shared/If.react';
import MoneyText from './shared/MoneyText.react';
import React, { Component } from 'react';
import Themes from '../design/themes';

import { StyleSheet, Text, View } from 'react-native';

import type { Dollars } from 'common/types/core';

export type Props = {
  netWorth: Dollars | null,
};

export default class NetWorth extends Component<Props> {
  render() {
    const theme = Themes.primary;
    const netWorthStyles = [
      theme.getTextStyleHeader2(),
      { color: theme.color.moneyTextPositive },
    ];
    return (
      <View style={styles.root}>
        <Text style={[theme.getTextStyleHeader3(), styles.header]}>
          NET WORTH
        </Text>
        <If predicate={typeof this.props.netWorth === 'number'}>
          {/* GUARD AGAINST NaN Errors */}
          <MoneyText
            dollars={this.props.netWorth || 0}
            textStyle={netWorthStyles}
          />
        </If>
        <If predicate={typeof this.props.netWorth !== 'number'}>
          <Text style={netWorthStyles}>--</Text>
        </If>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 8,
  },

  root: {
    alignItems: 'center',
    paddingTop: 16,
  },
});
