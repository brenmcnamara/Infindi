/* @flow */

import Account from 'common/lib/models/Account';
import Downloading, {
  WIDTH as DOWNLOADING_WIDTH,
} from './shared/Downloading.react';
import MoneyText from './shared/MoneyText.react';
import React, { Component } from 'react';

import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  getCreditCardNumber,
  getCreditCardType,
  isCreditCardAccount,
} from '../common/credit-card-utils';
import { GetTheme } from '../design/components/Theme.react';

import type { AccountRaw } from 'common/lib/models/Account';
import type { Theme } from '../design/themes';

export type Props = {
  account: AccountRaw,
  isDownloading: boolean,
  isFirst: boolean,
  isLast: boolean,
  onSelect: () => any,
};

const DOWNLOADING_CONTAINER_WIDTH = DOWNLOADING_WIDTH + 8;

export const HEIGHT = 65;

export default class AccountItem extends Component<Props> {
  _downloadingTransition: Animated.Value;

  constructor(props: Props) {
    super(props);
    this._downloadingTransition = new Animated.Value(
      props.isDownloading ? 1.0 : 0.0,
    );
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (this.props.isDownloading === nextProps.isDownloading) {
      return;
    }

    Animated.timing(this._downloadingTransition, {
      duration: 300,
      toValue: nextProps.isDownloading ? 1.0 : 0.0,
    }).start();
  }

  render() {
    const account = Account.fromRaw(this.props.account);
    const { isFirst } = this.props;
    const topBorder = isFirst ? { borderTopWidth: 1 } : {};

    const downloadingStyles = [
      {
        opacity: this._downloadingTransition,
        width: this._downloadingTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [0, DOWNLOADING_CONTAINER_WIDTH],
        }),
      },
      styles.downloadingContainer,
    ];

    return (
      <GetTheme>
        {theme => (
          <TouchableOpacity onPress={this.props.onSelect} style={{ flex: 1 }}>
            <View
              style={[
                styles.root,
                topBorder,
                {
                  backgroundColor: theme.color.backgroundListItem,
                  borderColor: theme.color.borderNormal,
                },
              ]}
            >
              <View style={styles.mainContent}>
                <View style={styles.accountLoaderTop}>
                  {this._renderAccountName(theme)}
                  <MoneyText
                    dollars={account.balance}
                    textStyle={[
                      styles.accountBalance,
                      theme.getTextStyleNormalWithEmphasis(),
                    ]}
                  />
                </View>
                <View style={styles.accountLoaderBottom}>
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={[
                      styles.accountInstitution,
                      theme.getTextStyleSmall(),
                    ]}
                  >
                    {account.institution}
                  </Text>
                  <Text style={[styles.accountType, theme.getTextStyleSmall()]}>
                    {getFormattedAccountType(account.toRaw())}
                  </Text>
                </View>
              </View>
              <Animated.View style={downloadingStyles}>
                <Downloading />
              </Animated.View>
            </View>
          </TouchableOpacity>
        )}
      </GetTheme>
    );
  }

  _renderAccountName(theme: Theme) {
    const {account} = this.props;
    if (!isCreditCardAccount(account)) {
      return (
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={[
            styles.accountName,
            { color: theme.color.moneyTextPositive },
            theme.getTextStyleNormalWithEmphasis(),
          ]}
        >
          {Account.fromRaw(account).name}
        </Text>
      );
    }
    const creditCardType = getCreditCardType(account);
    const creditCardNumber = getCreditCardNumber(account);

    const typeFormatted =
      creditCardType === 'OTHER'
        ? 'Card'
        : creditCardType
            .split('_')
            .map(
              word =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
            )
            .join(' ');
    const numberFormatted = creditCardNumber.slice(-4);
    return (
      <Text
        style={[styles.accountName, theme.getTextStyleNormalWithEmphasis()]}
      >
        {typeFormatted}
        {' ending in '}
        {numberFormatted}
      </Text>
    );
  }
}

function getFormattedAccountType(account: AccountRaw): string {
  return Account.fromRaw(account).accountType.replace(/_/g, ' ');
}

const styles = StyleSheet.create({
  accountBalance: {
    textAlign: 'right',
  },

  accountInstitution: {
    flex: 1,
    paddingRight: 8,
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
    flex: 1,
    paddingRight: 8,
    textAlign: 'left',
  },

  accountType: {
    textAlign: 'right',
  },

  downloadingContainer: {
    alignItems: 'center',
    marginHorizontal: 4,
  },

  mainContent: {
    flex: 1,
  },

  root: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 4,
    paddingLeft: 8,
    paddingVertical: 8,
  },
});
