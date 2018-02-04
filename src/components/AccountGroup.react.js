/* @flow */

import AccountComponent from './Account.react';
import Colors from '../design/colors';
import InfoButton from './shared/InfoButton.react';
import MoneyText from './shared/MoneyText.react';
import React, { Component } from 'react';
import TextDesign from '../design/text';

import invariant from 'invariant';

import { getBalance } from 'common/lib/models/Account';
import {
  includesAccount,
  isPending,
} from 'common/lib/models/YodleeRefreshInfo';
import { mapObjectToArray, reduceObject } from '../common/obj-utils';
import { StyleSheet, Text, View } from 'react-native';

import type { Account, AccountGroupType } from 'common/lib/models/Account';
import type {
  AccountLoader,
  AccountLoaderCollection,
} from '../reducers/accounts';
import type { Dollars } from 'common/types/core';
import type { YodleeRefreshInfoLoaderCollection } from '../reducers/yodleeRefreshInfo';

export type Props = {
  accounts: AccountLoaderCollection,
  groupType: AccountGroupType,
  onPressGroupInfo: () => any,
  onSelectAccount: (account: AccountLoader) => any,
  refreshInfoCollection: YodleeRefreshInfoLoaderCollection,
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
    const { refreshInfoCollection } = this.props;
    invariant(loader.type === 'STEADY', 'Only supports steady accounts');
    const account = loader.model;
    return (
      <AccountComponent
        account={account}
        isDownloading={isAccountDownloading(refreshInfoCollection, account)}
        key={account.id}
        onSelect={() => this.props.onSelectAccount(loader)}
        showTopBorder={!isFirst}
      />
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

function isAccountDownloading(
  collection: YodleeRefreshInfoLoaderCollection,
  account: Account,
): bool {
  for (const refreshInfoID in collection) {
    if (collection.hasOwnProperty(refreshInfoID)) {
      const loader = collection[refreshInfoID];
      if (
        loader.type === 'STEADY' &&
        includesAccount(loader.model, account) &&
        isPending(loader.model)
      ) {
        return true;
      }
    }
  }
  return false;
}

const styles = StyleSheet.create({
  accountLoadersContainer: {
    borderColor: Colors.BORDER,
    borderWidth: 1,
    marginHorizontal: 4,
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
