/* @flow */

import Account from 'common/lib/models/Account';
import AccountGroupHeader, {
  HEIGHT as AccountGroupHeaderHeight,
} from './AccountGroupHeader.react';
import AccountItem, { HEIGHT as AccountItemHeight } from './AccountItem.react';
import AccountLinkGroupHeader, {
  HEIGHT as AccountLinkGroupHeaderHeight,
} from './AccountLinkGroupHeader.react';
import AccountLinkItem, {
  HEIGHT as AccountLinkItemHeight,
} from './AccountLinkItem.react';
import BannerManager from './shared/BannerManager.react';
import Content from './shared/Content.react';
import Footer from './shared/Footer.react';
import Icons from '../design/icons';
import If from './shared/If.react';
import List from '../list-ui/List.react';
import NetWorth, { HEIGHT as NetWorthHeight } from './NetWorth.react';
import React, { Component } from 'react';
import Screen from './shared/Screen.react';
import TextButton from './shared/TextButton.react';
import WatchSessionStateUtils from '../watch-session/state-utils';

import invariant from 'invariant';

import {
  AccountGroupInfo as AccountGroupInfoContent,
  AccountNullState as AccountNullStateContent,
} from '../../content';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { EMPTY_OBJ } from '../constants';
import { filterObject, isObjectEmpty, reduceObject } from '../common/obj-utils';
import { getLoginPayload } from '../auth/state-utils';
import { getNetWorth } from '../common/state-utils';
import { GetTheme } from '../design/components/Theme.react';
import { requestProviderLogin, requestProviderSearch } from '../link/action';
import { requestInfoModal } from '../actions/modal';
import { throttle } from '../common/generic-utils';
import { viewAccountDetails } from '../actions/router';

import type AccountLink from 'common/lib/models/AccountLink';

import type { AccountGroupType, AccountRaw } from 'common/lib/models/Account';
import type {
  AccountContainer,
  AccountLinkContainer,
} from '../data-model/types';
import type { Dollars } from 'common/types/core';
import type { ReduxProps } from '../store';
import type { State as ReduxState } from '../reducers/root';
import type { Theme } from '../design/themes';

export type Props = ReduxProps & ComputedProps;

type ComputedProps = {
  accountLinkContainer: AccountLinkContainer,
  accounts: AccountContainer,
  isDownloading: boolean,
  isInWatchSession: boolean,
  netWorth: number,
};

class AccountsScreen extends Component<Props> {
  render() {
    return (
      <GetTheme>
        {theme => (
          <Screen avoidNavBar={true} avoidTabBar={true}>
            {/* CONTENT */}
            {this._renderAccounts(theme)}
            {this._renderAccountsLoading(theme)}
            {this._renderNullState(theme)}
            {/* FOOTER */}
            {this._renderAddAccountButton(theme)}
          </Screen>
        )}
      </GetTheme>
    );
  }

  _renderAccountsLoading(theme: Theme) {
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

  _renderAccounts(theme: Theme) {
    const { isDownloading, accounts } = this.props;

    return (
      <If predicate={!isDownloading && !isObjectEmpty(accounts)}>
        <Content>
          <BannerManager
            channels={['CORE', 'ACCOUNTS']}
            managerKey="ACCOUNTS"
          />
          <List
            contentInset={{ bottom: 4, left: 0, right: 0, top: 0 }}
            data={this._getData()}
            initialNumToRender={20}
          />
        </Content>
      </If>
    );
  }

  _renderNullState(theme: Theme) {
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
                  theme.getTextStyleHeader3(),
                  styles.marginBottom16,
                  styles.textCenter,
                ]}
              >
                You Have No Accounts
              </Text>
              <Text style={[theme.getTextStyleNormal(), styles.textCenter]}>
                {AccountNullStateContent}
              </Text>
            </View>
          </View>
        </Content>
      </If>
    );
  }

  _renderAddAccountButton(theme: Theme) {
    return (
      <If predicate={!this.props.isDownloading && !this.props.isInWatchSession}>
        <Footer
          style={[styles.footer, { borderColor: theme.color.borderHairline }]}
        >
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

  _onPressAddAccount = throttle(500, (): void => {
    this.props.dispatch(requestProviderSearch());
  });

  _onSelectGroupInfo = throttle(
    500,
    (theme: Theme, groupType: AccountGroupType): void => {
      const content = AccountGroupInfoContent[groupType];
      invariant(content, 'No info exists for group type: %s.', groupType);
      this.props.dispatch(
        requestInfoModal({
          id: `GROUP_INFO_${groupType}`,
          priority: 'USER_REQUESTED',
          render: () => (
            <Text style={theme.getTextStyleNormal()}>{content}</Text>
          ),
          title: getFormattedGroupType(groupType),
        }),
      );
    },
  );

  _onSelectAccount = throttle(500, (account: AccountRaw): void => {
    this.props.dispatch(viewAccountDetails(account.id));
  });

  _onSelectAccountLink = throttle(500, (accountLink: AccountLink): void => {
    if (this.props.isInWatchSession) {
      this.props.dispatch(
        requestInfoModal({
          id: 'PREVENT_ROUTING_TO_PROVIDER_LOGIN',
          priority: 'USER_REQUESTED',
          render: () => (
            <GetTheme>
              {(theme: Theme) => (
                <Text
                  style={theme.getTextStyleNormal()}
                >{`Cannot view the institution login page for someone else's account`}</Text>
              )}
            </GetTheme>
          ),
          title: 'OFF LIMITS',
        }),
      );
    } else {
      this.props.dispatch(requestProviderLogin(accountLink.providerRef.refID));
    }
  });

  _getData() {
    const accountLinks = this._getAccountLinksRequiringAttention();
    const { accounts } = this.props;
    const groupList = [
      {
        container: filterObject(
          accounts,
          account => Account.fromRaw(account).groupType === 'AVAILABLE_CASH',
        ),
        type: 'AVAILABLE_CASH',
      },
      {
        container: filterObject(
          accounts,
          account => Account.fromRaw(account).groupType === 'CREDIT_CARD_DEBT',
        ),
        type: 'CREDIT_CARD_DEBT',
      },
      {
        container: filterObject(
          accounts,
          account => Account.fromRaw(account).groupType === 'DEBT',
        ),
        type: 'DEBT',
      },
      {
        container: filterObject(
          accounts,
          account =>
            Account.fromRaw(account).groupType === 'LIQUID_INVESTMENTS',
        ),
        type: 'LIQUID_INVESTMENTS',
      },
      {
        container: filterObject(
          accounts,
          account =>
            Account.fromRaw(account).groupType === 'NON_LIQUID_INVESTMENTS',
        ),
        type: 'NON_LIQUID_INVESTMENTS',
      },
      {
        container: filterObject(
          accounts,
          account => Account.fromRaw(account).groupType === 'OTHER',
        ),
        type: 'OTHER',
      },
    ];

    const rows = [
      {
        Comp: () => <NetWorth netWorth={this.props.netWorth} />,
        height: NetWorthHeight,
        key: 'NET_WORTH',
      },
    ];

    if (accountLinks.length > 0) {
      rows.push({
        Comp: AccountLinkGroupHeader,
        height: AccountLinkGroupHeaderHeight,
        key: 'LINK_HEADER',
      });
      accountLinks.forEach((accountLink, index: number) => {
        rows.push({
          Comp: () => (
            <AccountLinkItem
              accountLink={accountLink}
              isFirst={index === 0}
              onSelectAccountLink={() => this._onSelectAccountLink(accountLink)}
            />
          ),
          height: AccountLinkItemHeight,
          key: accountLink.id,
        });
      });
    }

    groupList.forEach(group => {
      if (isObjectEmpty(group.container)) {
        return;
      }
      const balance = getTotalBalanceForAccountContainer(group.container);
      rows.push({
        Comp: () => (
          <GetTheme>
            {(theme: Theme) => (
              <AccountGroupHeader
                balance={balance}
                groupType={group.type}
                onSelectInfo={() => this._onSelectGroupInfo(theme, group.type)}
              />
            )}
          </GetTheme>
        ),
        height: AccountGroupHeaderHeight,
        key: `ACCOUNT_GROUP_HEADER / ${group.type}`,
      });

      const { accountLinkContainer } = this.props;

      // $FlowFixMe - This is correct.
      const accounts: Array<AccountRaw> = Object.values(group.container);

      accounts.forEach((account: AccountRaw, index: number) => {
        const accountLink =
          accountLinkContainer[account.accountLinkRef.refID] || null;
        const isDownloading = Boolean(
          accountLink && (accountLink.isLinking || accountLink.isInMFA),
        );

        rows.push({
          Comp: () => (
            <AccountItem
              account={account}
              isDownloading={isDownloading}
              isFirst={index === 0}
              isLast={index === accounts.length - 1}
              onSelect={() => this._onSelectAccount(account)}
            />
          ),
          height: AccountItemHeight,
          key: `ACCOUNT / ${account.id}`,
        });
      });
    });

    return rows;
  }

  _getAccountLinksRequiringAttention(): Array<AccountLink> {
    const container = this.props.accountLinkContainer;
    const accountLinks = [];
    // $FlowFixMe - This is correct.
    Object.values(container).forEach((accountLink: AccountLink) => {
      // Put all linking account links at the beginning of the array.
      if (accountLink.isLinking || accountLink.isInMFA) {
        accountLinks.unshift(accountLink);
      }
      // Put all failed account links at the end of the array.
      if (accountLink.isLinkFailure) {
        accountLinks.push(accountLink);
      }
    });
    return accountLinks;
  }
}

function mapReduxStateToProps(state: ReduxState): ComputedProps {
  const { accountLinks, accounts } = state;
  const loginPayload = getLoginPayload(state);
  invariant(
    loginPayload,
    'Trying to render account data when no user is logged in',
  );
  return {
    accountLinkContainer:
      accountLinks.type === 'STEADY' ? accountLinks.container : EMPTY_OBJ,
    accounts: accounts.type === 'STEADY' ? accounts.container : EMPTY_OBJ,
    isDownloading: accounts.type === 'DOWNLOADING',
    isInWatchSession: WatchSessionStateUtils.getIsInWatchSession(state),
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

function getTotalBalanceForAccountContainer(group: AccountContainer): Dollars {
  return reduceObject(group, (total, account) => total + account.balance, 0);
}
