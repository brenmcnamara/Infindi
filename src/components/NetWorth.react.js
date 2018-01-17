/* @flow */

import Colors from '../design/colors';
import If from './shared/If.react';
import MoneyText from './shared/MoneyText.react';
import React, { Component } from 'react';
import TextDesign from '../design/text';

import { StyleSheet, Text, View } from 'react-native';

import type { Dollars } from 'common/types/core';

export type Props = {
  netWorth: Dollars | null,
};

export default class NetWorth extends Component<Props> {
  render() {
    return (
      <View style={styles.root}>
        <Text style={[TextDesign.header3, styles.header]}>NET WORTH</Text>
        <If predicate={typeof this.props.netWorth === 'number'}>
          {/* GUARD AGAINST NaN Errors */}
          <MoneyText
            dollars={this.props.netWorth || 0}
            textStyle={[TextDesign.header2, styles.netWorth]}
          />
        </If>
        <If predicate={typeof this.props.netWorth !== 'number'}>
          <Text style={[TextDesign.header2, styles.netWorth]}>--</Text>
        </If>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 8,
  },

  netWorth: {
    color: Colors.MONEY_GOOD,
  },

  root: {
    alignItems: 'center',
    paddingTop: 16,
  },
});
