/* @flow */

import Icons from '../design/icons';
import React, { Component } from 'react';

import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GetTheme } from '../design/components/Theme.react';
import { isLinkFailure } from 'common/lib/models/AccountLink';

import type { AccountLink } from 'common/lib/models/AccountLink';
import type { Theme } from '../design/themes';

export type Props = {
  accountLinks: Array<AccountLink>,
  onSelectAccountLink: (accountLink: AccountLink) => any,
};

export default class AccountLinkGroup extends Component<Props> {
  render() {
    return (
      <GetTheme>
        {(theme: Theme) => (
          <View style={styles.root}>
            {this._renderHeader(theme)}
            {this.props.accountLinks.map((accountLink, index) =>
              this._renderAccountLink(theme, accountLink, index === 0),
            )}
          </View>
        )}
      </GetTheme>
    );
  }

  _renderHeader(theme: Theme) {
    return (
      <View style={[styles.header, { borderColor: theme.color.borderNormal }]}>
        <Text
          style={[styles.headerText, theme.getTextStyleNormalWithEmphasis()]}
        >
          ACCOUNT LINKS
        </Text>
      </View>
    );
  }

  _renderAccountLink(theme: Theme, accountLink: AccountLink, isFirst: boolean) {
    const topBorder = isFirst ? { borderTopWidth: 1 } : null;
    return (
      <View
        key={accountLink.id}
        style={[
          styles.accountLink,
          topBorder,
          {
            backgroundColor: theme.color.backgroundListItem,
            borderColor: theme.color.borderNormal,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => this.props.onSelectAccountLink(accountLink)}
        >
          <View style={styles.accountLinkContent}>
            <View style={styles.accountLinkLeft}>
              <Text style={theme.getTextStyleNormalWithEmphasis()}>
                Name Coming Soon
              </Text>
              {this._renderAccountLinkNotice(theme, accountLink)}
            </View>
            <View style={styles.accountLinkRight}>
              {this._renderAccountLinkStatusIndicator(theme, accountLink)}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  _renderAccountLinkNotice(theme: Theme, accountLink: AccountLink) {
    let message = '';
    switch (accountLink.status) {
      case 'FAILURE / BAD_CREDENTIALS':
        message = 'LOGIN FAILED';
        break;

      case 'FAILURE / EXTERNAL_SERVICE_FAILURE':
      case 'FAILURE / INTERNAL_SERVICE_FAILURE':
        message = 'UNKNOWN ERROR';
        break;

      case 'FAILURE / MFA_FAILURE':
      case 'FAILURE / USER_INPUT_REQUEST_IN_BACKGROUND':
        message = 'ADDITIONAL INFO REQUIRED';
        break;

      case 'IN_PROGRESS / INITIALIZING':
      case 'IN_PROGRESS / VERIFYING_CREDENTIALS':
      case 'IN_PROGRESS / DOWNLOADING_DATA':
        message = 'LINK IN PROGRESS';
        break;

      case 'MFA / PENDING_USER_INPUT':
      case 'MFA / WAITING_FOR_LOGIN_FORM':
        message = 'MULTI FACTOR AUTHENTICATION';
        break;
    }
    return (
      <Text style={[styles.accountLinkNotice, theme.getTextStyleSmall()]}>
        {message}
      </Text>
    );
  }

  _renderAccountLinkStatusIndicator(theme: Theme, accountLink: AccountLink) {
    if (isLinkFailure(accountLink)) {
      return (
        <Image source={Icons.Error} style={styles.accountLinkStatusIndicator} />
      );
    }
    return <ActivityIndicator size="small" />;
  }
}

const styles = StyleSheet.create({
  accountLink: {
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    marginHorizontal: 4,
  },

  accountLinkContent: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  accountLinkLeft: {
    flex: 1,
  },

  accountLinkNotice: {
    marginTop: 4,
  },

  accountLinkRight: {
    marginRight: 4,
  },

  accountLinkStatusIndicator: {},

  header: {
    borderBottomWidth: 1,
    marginBottom: 4,
    paddingBottom: 4,
    paddingHorizontal: 8,
  },

  headerText: {},

  root: {
    marginTop: 8,
  },
});
