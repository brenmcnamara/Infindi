/* @flow */

import AccountGroup from './AccountGroup.react';
import BannerManager from './shared/BannerManager.react';
import Colors from '../design/colors';
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
import nullthrows from 'nullthrows';

import {
  AccountGroupInfo as AccountGroupInfoContent,
  AccountNullState as AccountNullStateContent,
} from '../../content';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { filterObject, isObjectEmpty } from '../common/obj-utils';
import { getGroupType } from 'common/lib/models/Account';
import { getLoginPayload, getNetWorth } from '../store/state-utils';
import { requestAccountVerification } from '../yodlee/action';
import { requestInfoModal, requestUnimplementedModal } from '../actions/modal';

import type { Account, AccountGroupType } from 'common/lib/models/Account';
import type {
  AccountLoader,
  AccountLoaderCollection,
} from '../reducers/accounts';
import type { Dollars } from 'common/types/core';
import type { ReduxProps } from '../typesDEPRECATED/redux';
import type { State as ReduxState } from '../reducers/root';

export type Props = ReduxProps & {
  isDownloading: bool,
  loaderCollection: AccountLoaderCollection,
  netWorth: number,
};

type RowItem =
  | {|
      +key: string,
      +netWorth: Dollars | null,
      +rowType: 'NET_WORTH',
    |}
  | {|
      +accounts: AccountLoaderCollection,
      +groupType: AccountGroupType,
      +key: string,
      +rowType: 'ACCOUNTS',
    |};

class AccountsScreen extends Component<Props> {
  render() {
    return (
      <Screen avoidNavBar={true} avoidTabBar={true}>
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
          <BannerManager
            channels={['CORE', 'ACCOUNTS']}
            managerKey="ACCOUNTS"
          />
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        </Content>
      </If>
    );
  }

  _renderAccounts() {
    const { isDownloading, loaderCollection } = this.props;

    return (
      <If predicate={!isDownloading && !isObjectEmpty(loaderCollection)}>
        <Content>
          <BannerManager
            channels={['CORE', 'ACCOUNTS']}
            managerKey="ACCOUNTS"
          />
          <FlatList
            automaticallyAdjustContentInsets={false}
            data={this._getData()}
            renderItem={({ item }) => this._renderRowItem(nullthrows(item))}
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
          <BannerManager
            channels={['CORE', 'ACCOUNTS']}
            managerKey="ACCOUNTS"
          />
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
                {AccountNullStateContent}
              </Text>
            </View>
          </View>
        </Content>
      </If>
    );
  }

  _renderAddAccountButton() {
    return (
      <If predicate={!this.props.isDownloading}>
        <Footer style={styles.footer}>
          <TextButton
            layoutType="FILL_PARENT"
            onPress={this._onPressAddAccount}
            size="LARGE"
            text="ADD ACCOUNT"
            type="PRIMARY"
          />
        </Footer>
      </If>
    );
  }

  _renderRowItem = (item: RowItem) => {
    switch (item.rowType) {
      case 'NET_WORTH': {
        return <NetWorth netWorth={item.netWorth} />;
      }
      case 'ACCOUNTS': {
        const { accounts, groupType } = item;
        return (
          <AccountGroup
            accounts={accounts}
            groupType={groupType}
            onPressGroupInfo={() => this._onPressGroupInfo(groupType)}
            onSelectAccount={this._onSelectAccount}
          />
        );
      }
    }
    invariant(false, 'Unrecognized item type: %s', item.rowType);
  };

  _onPressAddAccount = (): void => {
    this.props.dispatch(requestAccountVerification());
  };

  _onPressGroupInfo = (groupType: AccountGroupType): void => {
    const content = AccountGroupInfoContent[groupType];
    invariant(content, 'No info exists for group type: %s.', groupType);
    this.props.dispatch(
      requestInfoModal({
        id: `GROUP_INFO_${groupType}`,
        priority: 'USER_REQUESTED',
        render: () => <Text style={TextDesign.normal}>{content}</Text>,
        title: getFormattedGroupType(groupType),
      }),
    );
  };

  _onSelectAccount = (account: AccountLoader): void => {
    this.props.dispatch(requestUnimplementedModal('View Account Transactions'));
  };

  _getData() {
    const { loaderCollection } = this.props;
    const availableCashGroup = filterObject(loaderCollection, loader => {
      const account = getAccount(loader);
      return getGroupType(account) === 'AVAILABLE_CASH';
    });
    const shortTermDebtGroup = filterObject(loaderCollection, loader => {
      const account = getAccount(loader);
      return getGroupType(account) === 'SHORT_TERM_DEBT';
    });
    const investmentsGroup = filterObject(loaderCollection, loader => {
      const account = getAccount(loader);
      return getGroupType(account) === 'INVESTMENTS';
    });
    const otherGroup = filterObject(loaderCollection, loader => {
      const account = getAccount(loader);
      return getGroupType(account) === 'OTHER';
    });
    return [
      {
        key: '1',
        netWorth: this.props.netWorth,
        rowType: 'NET_WORTH',
      },
      isObjectEmpty(availableCashGroup)
        ? null
        : {
            accounts: availableCashGroup,
            groupType: 'AVAILABLE_CASH',
            key: 'AVAILABLE_CASH',
            rowType: 'ACCOUNTS',
          },
      isObjectEmpty(shortTermDebtGroup)
        ? null
        : {
            accounts: shortTermDebtGroup,
            groupType: 'SHORT_TERM_DEBT',
            key: 'SHORT_TERM_DEBT',
            rowType: 'ACCOUNTS',
          },
      isObjectEmpty(investmentsGroup)
        ? null
        : {
            accounts: investmentsGroup,
            groupType: 'INVESTMENTS',
            key: 'INVESTMENTS',
            rowType: 'ACCOUNTS',
          },
      isObjectEmpty(otherGroup)
        ? null
        : {
            accounts: otherGroup,
            groupType: 'OTHER',
            key: 'OTHER',
            rowType: 'ACCOUNTS',
          },
    ].filter(truthy => truthy);
  }
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
    loaderCollection:
      accounts.type === 'STEADY' ? accounts.loaderCollection : {},
    netWorth: getNetWorth(state),
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
    borderColor: Colors.BORDER_HAIRLINE,
    borderTopWidth: 1,
    justifyContent: 'center',
  },

  loadingContainer: {
    alignItems: 'center',
    flex: 1,
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

function getAccount(loader: AccountLoader): Account {
  invariant(loader.type === 'STEADY', 'Only support steady account loaders');
  return loader.model;
}

export function getFormattedGroupType(groupType: AccountGroupType): string {
  return (
    groupType
      .split('_')
      // Capitalize first letter only.
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  );
}
