/* @flow */

import AccountGroup from './AccountGroup.react';
import Content from './shared/Content.react';
import Footer from './shared/Footer.react';
import Icons from '../design/icons';
import If from './shared/If.react';
import NetWorth from './NetWorth.react';
import React, { Component } from 'react';
import Screen from './shared/Screen.react';
import TextButton from './shared/TextButton.react';
import TextDesign from '../design/text';

import invariant from 'invariant';

import { AccountNullState } from '../../content';
import { connect } from 'react-redux';
import { getLoginPayload } from '../store/state-utils';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { isObjectEmpty } from '../common/obj-utils';

import type { AccountLoaderCollection } from '../reducers/accounts';
import type { Dollars } from '../types/core';
import type { ReduxProps } from '../types/redux';
import type { State as ReduxState } from '../reducers/root';

export type Props = ReduxProps & {
  isDownloading: bool,
  loaderCollection: AccountLoaderCollection,
  netWorth: Dollars | null,
};

type RowItem =
  | {|
      +key: string,
      +netWorth: Dollars | null,
      +rowType: 'NET_WORTH',
    |}
  | {|
      +accounts: AccountLoaderCollection,
      +accountType: 'AVAILABLE_CASH',
      +key: string,
      +rowType: 'ACCOUNTS',
    |};

class AccountsScreen extends Component<Props> {
  render() {
    return (
      <Screen>
        {/* CONTENT */}
        {this._renderAccounts()}
        {this._renderAccountsLoading()}
        {this._renderNullState()}
        {/* FOOTER */}
        {this._renderAddAccountButton()}
      </Screen>
    );
  }

  _renderAccountsLoading() {
    const { isDownloading } = this.props;
    return (
      <If predicate={isDownloading}>
        <Content>
          <Text>Loading</Text>
        </Content>
      </If>
    );
  }

  _renderAccounts() {
    const { isDownloading, loaderCollection, netWorth } = this.props;
    return (
      <If predicate={!isDownloading && !isObjectEmpty(loaderCollection)}>
        <Content>
          <FlatList
            data={[
              {
                key: '1',
                netWorth,
                rowType: 'NET_WORTH',
              },
              {
                key: '2',
                accounts: loaderCollection,
                accountType: 'AVAILABLE_CASH',
                rowType: 'ACCOUNTS',
              },
            ]}
            renderItem={({ item }) => this._renderRowItem(item)}
          />
        </Content>
      </If>
    );
  }

  _renderNullState() {
    const { isDownloading, loaderCollection } = this.props;
    return (
      <If predicate={!isDownloading && isObjectEmpty(loaderCollection)}>
        <Content>
          <View style={styles.nullContainer}>
            <Image
              resizeMode="contain"
              source={Icons.BankColored}
              style={styles.bankIcon}
            />
            <View style={styles.nullTextContainer}>
              <Text
                style={[
                  TextDesign.header3,
                  styles.marginBottom16,
                  styles.textCenter,
                ]}
              >
                You Have No Accounts
              </Text>
              <Text style={[TextDesign.normal, styles.textCenter]}>
                {AccountNullState}
              </Text>
            </View>
          </View>
        </Content>
      </If>
    );
  }

  _renderAddAccountButton() {
    return (
      <Footer style={styles.footer}>
        <TextButton
          onPress={this._onPressAddAccount}
          size="LARGE"
          text="ADD ACCOUNT"
          type="PRIMARY"
        />
      </Footer>
    );
  }

  _renderRowItem = (item: RowItem) => {
    switch (item.rowType) {
      case 'NET_WORTH':
        return <NetWorth netWorth={item.netWorth} />;
      case 'ACCOUNTS':
        return (
          <AccountGroup groupType="AVAILABLE_CASH" accounts={item.accounts} />
        );
    }
    invariant(false, 'Unrecognized item type: %s', item.rowType);
  };

  _onPressAddAccount = (): void => {};
}

function mapReduxStateToProps(state: ReduxState) {
  const { accounts } = state;
  const loginPayload = getLoginPayload(state);
  invariant(
    loginPayload,
    'Trying to render account data when no user is logged in',
  );
  return {
    isDownloading: accounts.type === 'DOWNLOADING',
    netWorth: loginPayload.userMetrics.netWorth,
    loaderCollection:
      accounts.type === 'STEADY' ? accounts.loaderCollection : {},
  };
}

export default connect(mapReduxStateToProps)(AccountsScreen);

const styles = StyleSheet.create({
  bankIcon: {
    marginBottom: 40,
    width: 123,
  },

  footer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  marginBottom16: {
    marginBottom: 16,
  },

  nullContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  nullTextContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  textCenter: {
    textAlign: 'center',
  },
});
