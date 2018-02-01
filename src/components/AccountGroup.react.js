/* @flow */

import Colors from '../design/colors';
import InfoButton from './shared/InfoButton.react';
import MoneyText from './shared/MoneyText.react';
import React, { Component } from 'react';
import TextDesign from '../design/text';

import invariant from 'invariant';

import {
  getAccountName,
  getAccountType,
  getBalance,
  getInstitution,
} from 'common/lib/models/Account';
import { mapObjectToArray, reduceObject } from '../common/obj-utils';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { Account, AccountGroupType } from 'common/lib/models/Account';
import type {
  AccountLoader,
  AccountLoaderCollection,
} from '../reducers/accounts';
import type { Dollars } from 'common/types/core';

export type Props = {
  accounts: AccountLoaderCollection,
  groupType: AccountGroupType,
  onPressGroupInfo: () => any,
  onSelectAccount: (account: AccountLoader) => any,
};

// TODO: Rename to AccountsGroup
export default class AccountGroup extends Component<Props> {
  render() {
    return (
      <View style={styles.root}>
        {this._renderHeader()}
        <View style={styles.accountLoadersContainer}>
          {mapObjectToArray(this.props.accounts, (accountLoader, _, i) =>
            this._renderAccountLoader(accountLoader, i === 0),
          )}
        </View>
      </View>
    );
  }

  _renderHeader() {
    return (
      <View style={styles.header}>
        <Text style={[TextDesign.smallWithEmphasis, styles.groupType]}>
          {this._getFormattedGroupType()}
        </Text>
        <InfoButton onPress={this.props.onPressGroupInfo} />
        <MoneyText
          dollars={this._getGroupBalance()}
          textStyle={[TextDesign.normalWithEmphasis, styles.groupBalance]}
        />
      </View>
    );
  }

  _renderAccountLoader(loader: AccountLoader, isFirst: bool) {
    invariant(
      loader.type === 'STEADY',
      'As of now, only STEADY account loaders can be rendered',
    );
    const topBorder = isFirst ? {} : { borderTopWidth: 1 };
    const account = loader.model;
    return (
      <View key={account.id} style={[styles.accountLoaderRoot, topBorder]}>
        <TouchableOpacity onPress={() => this.props.onSelectAccount(loader)}>
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

  _getGroupBalance(): Dollars {
    return reduceObject(
      this.props.accounts,
      (sum, loader) => {
        const balance = loader.type === 'STEADY' ? getBalance(loader.model) : 0;
        return sum + balance;
      },
      0,
    );
  }

  _getFormattedGroupType(): string {
    return this.props.groupType.replace(/_/g, ' ');
  }
}

function getFormattedAccountType(account: Account): string {
  return getAccountType(account).replace(/_/g, ' ');
}

const styles = StyleSheet.create({
  accountLoaderRoot: {
    backgroundColor: 'white',
    borderColor: Colors.BORDER,
    padding: 8,
  },

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

  accountLoadersContainer: {
    borderColor: Colors.BORDER,
    borderWidth: 1,
    marginHorizontal: 4,
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

  groupBalance: {
    color: Colors.MONEY_GOOD,
    flex: 1,
    textAlign: 'right',
  },

  groupType: {
    marginRight: 4,
  },

  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.BORDER,
    flexDirection: 'row',
    marginBottom: 4,
    paddingBottom: 4,
    paddingHorizontal: 8,
  },

  root: {
    marginVertical: 16,
  },
});
