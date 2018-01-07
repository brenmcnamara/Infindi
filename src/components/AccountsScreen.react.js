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
import {
  formatGroupType,
  getGroupTypeForAccountLoader,
} from '../common/db-utils';
import { getLoginPayload } from '../store/state-utils';
import { plaidLinkAccount } from '../actions/plaid';
import { requestInfoModal, requestUnimplementedModal } from '../actions/modal';

import type {
  AccountLoader,
  AccountLoaderCollection,
} from '../reducers/accounts';
import type { Dollars } from 'common/src/types/core';
import type { GroupType } from '../common/db-utils';
import type { ReduxProps } from '../typesDEPRECATED/redux';
import type { State as ReduxState } from '../reducers/root';

export type Props = ReduxProps & {
  isDownloading: bool,
  isLinkAvailable: bool,
  isPlaidLinkAvailable: bool,
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
      +groupType: GroupType,
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
      <If
        predicate={this.props.isPlaidLinkAvailable && !this.props.isDownloading}
      >
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
    this.props.dispatch(plaidLinkAccount());
  };

  _onPressGroupInfo = (groupType: GroupType): void => {
    const content = AccountGroupInfoContent[groupType];
    invariant(content, 'No info exists for group type: %s.', groupType);
    this.props.dispatch(
      requestInfoModal({
        id: `GROUP_INFO_${groupType}`,
        priority: 'USER_REQUESTED',
        render: () => <Text style={TextDesign.normal}>{content}</Text>,
        title: formatGroupType(groupType),
      }),
    );
  };

  _onSelectAccount = (account: AccountLoader): void => {
    this.props.dispatch(requestUnimplementedModal('View Account Transactions'));
  };

  _getData() {
    const { loaderCollection, netWorth } = this.props;
    const availableCashGroup = filterObject(loaderCollection, loader => {
      return getGroupTypeForAccountLoader(loader) === 'AVAILABLE_CASH';
    });
    const shortTermDebtGroup = filterObject(loaderCollection, loader => {
      return getGroupTypeForAccountLoader(loader) === 'SHORT_TERM_DEBT';
    });
    const otherGroup = filterObject(loaderCollection, loader => {
      return getGroupTypeForAccountLoader(loader) === 'OTHER';
    });
    return [
      {
        key: '1',
        netWorth,
        rowType: 'NET_WORTH',
      },
      isObjectEmpty(availableCashGroup)
        ? null
        : {
            key: '2',
            accounts: availableCashGroup,
            groupType: 'AVAILABLE_CASH',
            rowType: 'ACCOUNTS',
          },
      isObjectEmpty(shortTermDebtGroup)
        ? null
        : {
            key: '3',
            accounts: shortTermDebtGroup,
            groupType: 'SHORT_TERM_DEBT',
            rowType: 'ACCOUNTS',
          },
      isObjectEmpty(otherGroup)
        ? null
        : {
            key: '4',
            accounts: otherGroup,
            groupType: 'OTHER',
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
    isPlaidLinkAvailable: state.plaid.isLinkAvailable,
    loaderCollection:
      accounts.type === 'STEADY' ? accounts.loaderCollection : {},
    netWorth: loginPayload.userMetrics.netWorth,
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
