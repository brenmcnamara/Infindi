/* @flow */

import If from './shared/If.react';
import MoneyText from './shared/MoneyText.react';
import React, { Component } from 'react';

import { GetTheme } from '../design/components/Theme.react';
import { StyleSheet, Text, View } from 'react-native';

import type { Dollars } from 'common/types/core';

export type Props = {
  netWorth: Dollars | null,
};

export const HEIGHT = 80;

export default class NetWorth extends Component<Props> {
  render() {
    return (
      <GetTheme>
        {theme => (
          <View style={styles.root}>
            <Text style={[theme.getTextStyleHeader3(), styles.header]}>
              NET WORTH
            </Text>
            <If predicate={typeof this.props.netWorth === 'number'}>
              {/* GUARD AGAINST NaN Errors */}
              <MoneyText
                dollars={this.props.netWorth || 0}
                textStyle={[
                  theme.getTextStyleHeader2(),
                  { color: theme.color.moneyTextPositive },
                ]}
              />
            </If>
            <If predicate={typeof this.props.netWorth !== 'number'}>
              <Text
                style={[
                  theme.getTextStyleHeader2(),
                  { color: theme.color.moneyTextPositive },
                ]}
              >
                --
              </Text>
            </If>
          </View>
        )}
      </GetTheme>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 8,
  },

  root: {
    alignItems: 'center',
    height: HEIGHT,
    paddingTop: 16,
  },
});
