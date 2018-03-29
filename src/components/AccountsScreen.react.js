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
import { getLoginPayload } from '../auth/state-utils';
import { getNetWorth } from '../common/state-utils';
import { requestAccountVerification } from '../link/action';
import { requestInfoModal } from '../actions/modal';
import { viewAccountDetails } from '../actions/router';

import type { Account, AccountGroupType } from 'common/lib/models/Account';
import type { AccountContainer } from '../reducers/accounts';
import type { AccountLinkContainer } from '../reducers/accountLinks';
import type { Dollars } from 'common/types/core';
import type { ReduxProps } from '../typesDEPRECATED/redux';
import type { State as ReduxState } from '../reducers/root';

export type Props = ReduxProps & ReduxStateProps;

type ReduxStateProps = {
  accountLinkContainer: AccountLinkContainer,
  accounts: AccountContainer,
  isDownloading: bool,
  netWorth: number,
};

type RowItem =
  | {|
      +key: string,
      +netWorth: Dollars | null,
      +rowType: 'NET_WORTH',
    |}
  | {|
      +accounts: AccountContainer,
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
    const { isDownloading, accounts } = this.props;

    return (
      <If predicate={!isDownloading && !isObjectEmpty(accounts)}>
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
    const { isDownloading, accounts } = this.props;
    return (
      <If predicate={!isDownloading && isObjectEmpty(accounts)}>
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
            accountLinkContainer={this.props.accountLinkContainer}
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

  _onSelectAccount = (account: Account): void => {
    this.props.dispatch(viewAccountDetails(account.id));
  };

  _getData() {
    const { accounts } = this.props;
    const availableCashGroup = filterObject(
      accounts,
      account => getGroupType(account) === 'AVAILABLE_CASH',
    );
    const shortTermDebtGroup = filterObject(
      accounts,
      account => getGroupType(account) === 'CREDIT_CARD_DEBT',
    );
    const longTermDebtGroup = filterObject(
      accounts,
      account => getGroupType(account) === 'DEBT',
    );
    const shortTermInvestmentsGroup = filterObject(
      accounts,
      account => getGroupType(account) === 'LIQUID_INVESTMENTS',
    );
    const longTermInvestmentsGroup = filterObject(
      accounts,
      account => getGroupType(account) === 'NON_LIQUID_INVESTMENTS',
    );
    const otherGroup = filterObject(
      accounts,
      account => getGroupType(account) === 'OTHER',
    );
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
            groupType: 'CREDIT_CARD_DEBT',
            key: 'CREDIT_CARD_DEBT',
            rowType: 'ACCOUNTS',
          },
      isObjectEmpty(longTermDebtGroup)
        ? null
        : {
            accounts: longTermDebtGroup,
            groupType: 'DEBT',
            key: 'DEBT',
            rowType: 'ACCOUNTS',
          },
      isObjectEmpty(shortTermInvestmentsGroup)
        ? null
        : {
            accounts: shortTermInvestmentsGroup,
            groupType: 'LIQUID_INVESTMENTS',
            key: 'LIQUID_INVESTMENTS',
            rowType: 'ACCOUNTS',
          },
      isObjectEmpty(longTermInvestmentsGroup)
        ? null
        : {
            accounts: longTermInvestmentsGroup,
            groupType: 'NON_LIQUID_INVESTMENTS',
            key: 'NON_LIQUID_INVESTMENTS',
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

function mapReduxStateToProps(state: ReduxState): ReduxStateProps {
  const { accountLinks, accounts } = state;
  const loginPayload = getLoginPayload(state);
  invariant(
    loginPayload,
    'Trying to render account data when no user is logged in',
  );
  return {
    accounts: accounts.type === 'STEADY' ? accounts.container : {},
    isDownloading: accounts.type === 'DOWNLOADING',
    netWorth: getNetWorth(state),
    accountLinkContainer:
      accountLinks.type === 'STEADY' ? accountLinks.container : {},
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

export function getFormattedGroupType(groupType: AccountGroupType): string {
  return (
    groupType
      .split('_')
      // Capitalize first letter only.
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  );
}
