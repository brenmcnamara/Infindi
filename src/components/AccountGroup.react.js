/* @flow */

import AccountComponent from './Account.react';
import InfoButton from './shared/InfoButton.react';
import MoneyText from './shared/MoneyText.react';
import React, { Component } from 'react';

import { getBalance } from 'common/lib/models/Account';
import { GetTheme } from '../design/components/Theme.react';
import { isLinking } from 'common/lib/models/AccountLink';
import { mapObjectToArray, reduceObject } from '../common/obj-utils';
import { StyleSheet, Text, View } from 'react-native';

import type { Account, AccountGroupType } from 'common/lib/models/Account';
import type {
  AccountContainer,
  AccountLinkContainer,
} from '../data-model/types';
import type { Dollars } from 'common/types/core';
import type { Theme } from '../design/themes';

export type Props = {
  accountLinkContainer: AccountLinkContainer,
  accounts: AccountContainer,
  groupType: AccountGroupType,
  onPressGroupInfo: () => any,
  onSelectAccount: (account: Account) => any,
};

// TODO: Rename to AccountsGroup
export default class AccountGroup extends Component<Props> {
  render() {
    return (
      <GetTheme>
        {theme => (
          <View style={styles.root}>
            {this._renderHeader(theme)}
            <View
              style={[
                styles.accountContainer,
                { borderColor: theme.color.borderNormal },
              ]}
            >
              {mapObjectToArray(this.props.accounts, (account, _, i) =>
                this._renderAccount(account, i === 0),
              )}
            </View>
          </View>
        )}
      </GetTheme>
    );
  }

  _renderHeader(theme: Theme) {
    return (
      <View style={[styles.header, { borderColor: theme.color.borderNormal }]}>
        <Text
          style={[theme.getTextStyleNormalWithEmphasis(), styles.groupType]}
        >
          {this._getFormattedGroupType()}
        </Text>
        <InfoButton onPress={this.props.onPressGroupInfo} />
        <MoneyText
          dollars={this._getGroupBalance()}
          textStyle={[
            theme.getTextStyleNormalWithEmphasis(),
            styles.groupBalance,
            { color: theme.color.moneyTextPositive },
          ]}
        />
      </View>
    );
  }

  _renderAccount(account: Account, isFirst: boolean) {
    const { accountLinkContainer } = this.props;
    return (
      <AccountComponent
        account={account}
        isDownloading={isAccountDownloading(accountLinkContainer, account)}
        key={account.id}
        onSelect={() => this.props.onSelectAccount(account)}
        showTopBorder={!isFirst}
      />
    );
  }

  _getGroupBalance(): Dollars {
    return reduceObject(
      this.props.accounts,
      (sum, account) => sum + getBalance(account),
      0,
    );
  }

  _getFormattedGroupType(): string {
    return this.props.groupType.replace(/_/g, ' ');
  }
}

function isAccountDownloading(
  container: AccountLinkContainer,
  account: Account,
): boolean {
  for (const accountLinkID in container) {
    if (container.hasOwnProperty(accountLinkID)) {
      const accountLink = container[accountLinkID];
      if (
        account.accountLinkRef.refID === accountLink.id &&
        isLinking(accountLink)
      ) {
        return true;
      }
    }
  }
  return false;
}

const styles = StyleSheet.create({
  accountContainer: {
    borderWidth: 1,
    marginHorizontal: 4,
  },

  groupBalance: {
    flex: 1,
    textAlign: 'right',
  },

  groupType: {
    marginRight: 4,
  },

  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginBottom: 4,
    paddingBottom: 4,
    paddingHorizontal: 8,
  },

  root: {
    marginVertical: 16,
  },
});
