/* @flow */

import AccountComponent from './Account.react';
import Colors from '../design/colors';
import InfoButton from './shared/InfoButton.react';
import MoneyText from './shared/MoneyText.react';
import React, { Component } from 'react';
import TextDesign from '../design/text';

import invariant from 'invariant';

import { getBalance } from 'common/lib/models/Account';
import { mapObjectToArray, reduceObject } from '../common/obj-utils';
import { StyleSheet, Text, View } from 'react-native';

import type { AccountGroupType } from 'common/lib/models/Account';
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
    invariant(loader.type === 'STEADY', 'Only supports steady accounts');
    return (
      <AccountComponent
        key={loader.model.id}
        loader={loader}
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
