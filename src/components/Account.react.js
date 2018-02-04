/* @flow */

import Colors from '../design/colors';
import Downloading, {
  WIDTH as DOWNLOADING_WIDTH,
} from './shared/Downloading.react';
import MoneyText from './shared/MoneyText.react';
import React, { Component } from 'react';
import TextDesign from '../design/text';

import {
  getAccountName,
  getAccountType,
  getBalance,
  getInstitution,
} from 'common/lib/models/Account';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type { Account } from 'common/lib/models/Account';

export type Props = {
  account: Account,
  isDownloading: bool,
  onSelect: () => any,
  showTopBorder: bool,
};

const DOWNLOADING_CONTAINER_WIDTH = DOWNLOADING_WIDTH + 8;

export default class AccountComponent extends Component<Props> {
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
    const { account, showTopBorder } = this.props;
    const topBorder = !showTopBorder ? {} : { borderTopWidth: 1 };
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
      <TouchableOpacity onPress={this.props.onSelect}>
        <View style={[styles.root, topBorder]}>
          <View style={styles.mainContent}>
            <View style={styles.accountLoaderTop}>
              <Text style={[styles.accountName, TextDesign.normalWithEmphasis]}>
                {getAccountName(account)}
              </Text>
              <MoneyText
                dollars={getBalance(account)}
                textStyle={[
                  styles.accountBalance,
                  TextDesign.normalWithEmphasis,
                ]}
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
          </View>
          <Animated.View style={downloadingStyles}>
            <Downloading />
          </Animated.View>
        </View>
      </TouchableOpacity>
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

  downloadingContainer: {
    alignItems: 'center',
    marginHorizontal: 4,
  },

  mainContent: {
    flex: 1,
  },

  root: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: Colors.BORDER,
    flexDirection: 'row',
    paddingLeft: 8,
    paddingVertical: 8,
  },
});
