/* @flow */

import AccountGroupHeader, {
  HEIGHT as AccountGroupHeaderHeight,
} from './components/AccountGroupHeader.react';
import AccountItem, {
  HEIGHT as AccountItemHeight,
} from './components/AccountItem.react';
import AccountLinkGroupHeader, {
  HEIGHT as AccountLinkGroupHeaderHeight,
} from './components/AccountLinkGroupHeader.react';
import AccountLinkItem, {
  HEIGHT as AccountLinkItemHeight,
} from './components/AccountLinkItem.react';
import AccountLinkStateUtils from './data-model/state-utils/AccountLink';
import AccountStateUtils from './data-model/state-utils/Account';
import AuthStateUtils from './auth/StateUtils';
import BannerManager from './banner/BannerManager.react';
import Content from './shared/Content.react';
import Footer from './shared/Footer.react';
import Icons from './design/icons';
import Immutable from 'immutable';
import List from './list-ui/List.react';
import LifeCycleStateUtils from './life-cycle/StateUtils';
import NetWorth, {
  HEIGHT as NetWorthHeight,
} from './components/NetWorth.react';
import React, { Component } from 'react';
import Screen from './shared/Screen.react';
import TextButton from './shared/TextButton.react';
import WatchSessionStateUtils from './watch-session/StateUtils';

import invariant from 'invariant';

import {
  AccountGroupInfo as AccountGroupInfoContent,
  AccountNullState as AccountNullStateContent,
} from '../content';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { getNetWorth } from './common/state-utils';
import { GetTheme } from './design/components/Theme.react';
import { requestProviderLogin, requestProviderSearch } from './link/Actions';
import { requestInfoModal } from './modal/Actions';
import { throttle } from './common/generic-utils';
import { viewAccountDetails } from './actions/router';

import type Account, {
  AccountCollection,
  AccountGroupType,
} from 'common/lib/models/Account';
import type AccountLink, {
  AccountLinkCollection,
} from 'common/lib/models/AccountLink';

import type { Dollars } from 'common/types/core';
import type { ReduxProps, ReduxState } from './store';
import type { Theme } from './design/themes';

export type Props = ReduxProps & ComputedProps;

type ComputedProps = {
  accountLinks: AccountLinkCollection,
  accounts: AccountCollection,
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
      isDownloading && (
        <Content>
          <BannerManager
            channels={['CORE', 'ACCOUNTS']}
            managerKey="ACCOUNTS"
          />
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        </Content>
      )
    );
  }

  _renderAccounts(theme: Theme) {
    const { isDownloading, accounts } = this.props;

    return (
      !isDownloading &&
      accounts.size > 0 && (
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
      )
    );
  }

  _renderNullState(theme: Theme) {
    const { isDownloading, accounts } = this.props;
    return (
      !isDownloading &&
      accounts.size <= 0 && (
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
                {'You Have No Accounts'}
              </Text>
              <Text style={[theme.getTextStyleNormal(), styles.textCenter]}>
                {AccountNullStateContent}
              </Text>
            </View>
          </View>
        </Content>
      )
    );
  }

  _renderAddAccountButton(theme: Theme) {
    return (
      !this.props.isDownloading &&
      !this.props.isInWatchSession && (
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
      )
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

  _onSelectAccount = throttle(500, (account: Account): void => {
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
    // TODO: METADATA
    const groupList = [
      {
        collection: accounts.filter(
          account => account.groupType === 'AVAILABLE_CASH',
        ),
        type: 'AVAILABLE_CASH',
      },
      {
        collection: accounts.filter(
          account => account.groupType === 'CREDIT_CARD_DEBT',
        ),
        type: 'CREDIT_CARD_DEBT',
      },
      {
        collection: accounts.filter(account => account.groupType === 'DEBT'),
        type: 'DEBT',
      },
      {
        collection: accounts.filter(
          account => account.groupType === 'LIQUID_INVESTMENTS',
        ),
        type: 'LIQUID_INVESTMENTS',
      },
      {
        collection: accounts.filter(
          account => account.groupType === 'NON_LIQUID_INVESTMENTS',
        ),
        type: 'NON_LIQUID_INVESTMENTS',
      },
      {
        collection: accounts.filter(account => account.groupType === 'OTHER'),
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

    if (accountLinks.size > 0) {
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
      if (group.collection.size <= 0) {
        return;
      }
      const balance = getTotalBalanceForAccountContainer(group.collection);
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

      const { accountLinks } = this.props;

      let index = 0;
      group.collection.forEach(account => {
        const accountLink = accountLinks.get(account.accountLinkRef.refID);
        const isDownloading = Boolean(
          accountLink && (accountLink.isLinking || accountLink.isInMFA),
        );

        rows.push({
          Comp: () => (
            <AccountItem
              account={account}
              isDownloading={isDownloading}
              isFirst={index === 0}
              isLast={index === group.collection.size - 1}
              onSelect={() => this._onSelectAccount(account)}
            />
          ),
          height: AccountItemHeight,
          key: `ACCOUNT / ${account.id}`,
        });
        ++index;
      });
    });

    return rows;
  }

  _getAccountLinksRequiringAttention(): Immutable.List<AccountLink> {
    return this.props.accountLinks.reduce((list, accountLink) => {
      // Put all linking account links at the beginning of the array.
      if (accountLink.isLinking || accountLink.isInMFA) {
        return list.unshift(accountLink);
      }
      // Put all failed account links at the end of the array.
      if (accountLink.isLinkFailure) {
        return list.push(accountLink);
      }
      return list;
    }, Immutable.List());
  }
}

function mapReduxStateToProps(reduxState: ReduxState): ComputedProps {
  const loginPayload = AuthStateUtils.getLoginPayload(reduxState);
  invariant(
    loginPayload,
    'Trying to render account data when no user is logged in',
  );
  return {
    accountLinks: AccountLinkStateUtils.getCollection(reduxState),
    accounts: AccountStateUtils.getCollection(reduxState),
    isDownloading:
      !LifeCycleStateUtils.didLoadAccounts(reduxState) ||
      !LifeCycleStateUtils.didLoadAccountLinks(reduxState),
    isInWatchSession: WatchSessionStateUtils.getIsInWatchSession(reduxState),
    netWorth: getNetWorth(reduxState),
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

function getTotalBalanceForAccountContainer(
  collection: AccountCollection,
): Dollars {
  return collection.reduce((sum, account) => sum + account.balance, 0);
}
