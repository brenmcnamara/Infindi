/* @flow */

import InfoButton from '../shared/components/InfoButton.react';
import MoneyText from '../shared/components/MoneyText.react';
import React, { Component } from 'react';

import { GetTheme } from '../design/components/Theme.react';
import { StyleSheet, Text, View } from 'react-native';

import type { AccountGroupType } from 'common/lib/models/Account';
import type { Dollars } from 'common/types/core';
import type { Theme } from '../design/themes';

export type Props = {
  balance: Dollars,
  groupType: AccountGroupType,
  onSelectInfo: () => any,
};

export const HEIGHT = 50;

export default class AccountGroupHeader extends Component<Props> {
  render() {
    return (
      <GetTheme>
        {(theme: Theme) => (
          <View style={styles.root}>
            <View
              style={[
                styles.content,
                { borderColor: theme.color.borderNormal },
              ]}
            >
              <Text
                style={[
                  theme.getTextStyleNormalWithEmphasis(),
                  styles.groupType,
                ]}
              >
                {this._getFormattedGroupType()}
              </Text>
              <InfoButton onPress={this.props.onSelectInfo} />
              <MoneyText
                dollars={this.props.balance}
                textStyle={[
                  theme.getTextStyleNormalWithEmphasis(),
                  styles.groupBalance,
                  { color: theme.color.moneyTextPositive },
                ]}
              />
            </View>
          </View>
        )}
      </GetTheme>
    );
  }

  _getFormattedGroupType(): string {
    return this.props.groupType.replace(/_/g, ' ');
  }
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginBottom: 4,
    paddingBottom: 4,
    paddingHorizontal: 8,
  },

  groupBalance: {
    flex: 1,
    textAlign: 'right',
  },

  groupType: {
    marginRight: 4,
  },

  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
