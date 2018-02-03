/* @flow */

import Colors from '../design/colors';
import MoneyText from '../components/shared/MoneyText.react';
import React, { Component } from 'react';
import TextDesign from '../design/text';

import invariant from 'invariant';

import {
  getAccountName,
  getAccountType,
  getBalance,
  getInstitution,
} from 'common/lib/models/Account';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { Account } from 'common/lib/models/Account';
import type { AccountLoader } from '../reducers/accounts';

export type Props = {
  loader: AccountLoader,
  onSelect: () => any,
  showTopBorder: bool,
};

export default class AccountComponent extends Component<Props> {
  render() {
    const { loader, showTopBorder } = this.props;
    invariant(
      loader.type === 'STEADY',
      'As of now, only STEADY account loaders can be rendered',
    );
    const topBorder = !showTopBorder ? {} : { borderTopWidth: 1 };
    const account = loader.model;
    return (
      <View style={[styles.root, topBorder]}>
        <TouchableOpacity onPress={this.props.onSelect}>
          <View style={styles.accountLoaderTop}>
            <Text style={[styles.accountName, TextDesign.normalWithEmphasis]}>
              {getAccountName(account)}
            </Text>
            <MoneyText
              dollars={getBalance(account)}
              textStyle={[styles.accountBalance, TextDesign.normalWithEmphasis]}
            />
          </View>
          <View style={styles.accountLoaderBottom}>
            <Text style={[styles.accountBank, TextDesign.small]}>
              {getInstitution(account)}
            </Text>
            <Text style={[styles.accountType, TextDesign.small]}>
              {getFormattedAccountType(account)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

function getFormattedAccountType(account: Account): string {
  return getAccountType(account).replace(/_/g, ' ');
}

const styles = StyleSheet.create({
  accountBalance: {
    textAlign: 'right',
  },

  accountBank: {
    flex: 1,
    textAlign: 'left',
  },

  accountLoaderBottom: {
    flexDirection: 'row',
    marginTop: 4,
  },

  accountLoaderTop: {
    flexDirection: 'row',
  },

  accountName: {
    color: Colors.MONEY_GOOD,
    flex: 1,
    textAlign: 'left',
  },

  accountType: {
    textAlign: 'right',
  },

  root: {
    backgroundColor: 'white',
    borderColor: Colors.BORDER,
    padding: 8,
  },
});
