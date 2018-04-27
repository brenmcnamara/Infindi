/* @flow */

import AccountGroupHeader from './AccountGroupHeader.react';
import AccountItem from './AccountItem.react';
import AccountLinkGroupHeader from './AccountLinkGroupHeader.react';
import AccountLinkItem from './AccountLinkItem.react';
import BannerManager from './shared/BannerManager.react';
import Content from './shared/Content.react';
import Footer from './shared/Footer.react';
import Icons from '../design/icons';
import If from './shared/If.react';
import NetWorth from './NetWorth.react';
import React, { Component } from 'react';
import Screen from './shared/Screen.react';
import TextButton from './shared/TextButton.react';
import WatchSessionStateUtils from '../watch-session/state-utils';

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
import { filterObject, isObjectEmpty, reduceObject } from '../common/obj-utils';
import { getBalance, getGroupType } from 'common/lib/models/Account';
import { getLoginPayload } from '../auth/state-utils';
import { getNetWorth } from '../common/state-utils';
import { GetTheme } from '../design/components/Theme.react';
import {
  isInMFA,
  isLinking,
  isLinkFailure,
} from 'common/lib/models/AccountLink';
import { requestProviderLogin, requestProviderSearch } from '../link/action';
import { requestInfoModal } from '../actions/modal';
import { viewAccountDetails } from '../actions/router';

import type { Account, AccountGroupType } from 'common/lib/models/Account';
import type {
  AccountContainer,
  AccountLinkContainer,
} from '../data-model/types';
import type { AccountLink } from 'common/lib/models/AccountLink';
import type { ComponentType } from 'react';
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

type RowItem = {|
  +Comp: ComponentType<any>,
  +key: string,
|};

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
          <FlatList
            automaticallyAdjustContentInsets={false}
            data={this._getData()}
            renderItem={({ item }) =>
              this._renderRowItem(theme, nullthrows(item))
            }
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

  _renderRowItem = (theme: Theme, item: RowItem) => {
    const { Comp } = item;
    return <Comp />;
  };

  _onPressAddAccount = (): void => {
    this.props.dispatch(requestProviderSearch());
  };

  _onSelectGroupInfo = (theme: Theme, groupType: AccountGroupType): void => {
    const content = AccountGroupInfoContent[groupType];
    invariant(content, 'No info exists for group type: %s.', groupType);
    this.props.dispatch(
      requestInfoModal({
        id: `GROUP_INFO_${groupType}`,
        priority: 'USER_REQUESTED',
        render: () => <Text style={theme.getTextStyleNormal()}>{content}</Text>,
        title: getFormattedGroupType(groupType),
      }),
    );
  };

  _onSelectAccount = (account: Account): void => {
    this.props.dispatch(viewAccountDetails(account.id));
  };

  _onSelectAccountLink = (accountLink: AccountLink): void => {
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
  };

  _getData() {
    const accountLinks = this._getAccountLinksRequiringAttention();
    const { accounts } = this.props;
    const groupList = [
      {
        container: filterObject(
          accounts,
          account => getGroupType(account) === 'AVAILABLE_CASH',
        ),
        type: 'AVAILABLE_CASH',
      },
      {
        container: filterObject(
          accounts,
          account => getGroupType(account) === 'CREDIT_CARD_DEBT',
        ),
        type: 'CREDIT_CARD_DEBT',
      },
      {
        container: filterObject(
          accounts,
          account => getGroupType(account) === 'DEBT',
        ),
        type: 'DEBT',
      },
      {
        container: filterObject(
          accounts,
          account => getGroupType(account) === 'LIQUID_INVESTMENTS',
        ),
        type: 'LIQUID_INVESTMENTS',
      },
      {
        container: filterObject(
          accounts,
          account => getGroupType(account) === 'NON_LIQUID_INVESTMENTS',
        ),
        type: 'NON_LIQUID_INVESTMENTS',
      },
      {
        container: filterObject(
          accounts,
          account => getGroupType(account) === 'OTHER',
        ),
        type: 'OTHER',
      },
    ];

    const rows = [
      {
        Comp: () => <NetWorth netWorth={this.props.netWorth} />,
        key: '1',
      },
    ];

    if (accountLinks.length > 0) {
      rows.push({
        Comp: AccountLinkGroupHeader,
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
        key: `ACCOUNT_GROUP_HEADER / ${group.type}`,
      });

      const { accountLinkContainer } = this.props;
      Object.values(group.container).forEach(
        // $FlowFixMe - This is correct.
        (account: Account, index: number) => {
          const accountLink =
            accountLinkContainer[account.accountLinkRef.refID] || null;
          const isDownloading = Boolean(
            accountLink && (isLinking(accountLink) || isInMFA(accountLink)),
          );

          rows.push({
            Comp: () => (
              <AccountItem
                account={account}
                isDownloading={isDownloading}
                isFirst={index === 0}
                onSelect={() => this._onSelectAccount(account)}
              />
            ),
            key: `ACCOUNT / ${account.id}`,
          });
        },
      );
    });

    return rows;
  }

  _getAccountLinksRequiringAttention(): Array<AccountLink> {
    const container = this.props.accountLinkContainer;
    const accountLinks = [];
    // $FlowFixMe - This is correct.
    Object.values(container).forEach((accountLink: AccountLink) => {
      // Put all linking account links at the beginning of the array.
      if (isLinking(accountLink) || isInMFA(accountLink)) {
        accountLinks.unshift(accountLink);
      }
      // Put all failed account links at the end of the array.
      if (isLinkFailure(accountLink)) {
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
      accountLinks.type === 'STEADY' ? accountLinks.container : {},
    accounts: accounts.type === 'STEADY' ? accounts.container : {},
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
  return reduceObject(
    group,
    (total, account) => total + getBalance(account),
    0,
  );
}
