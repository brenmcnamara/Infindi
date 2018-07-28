/* @flow */

import Icons from '../../design/icons';
import React, { Component } from 'react';

import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GetTheme } from '../../design/components/Theme.react';

import type AccountLink from 'common/lib/models/AccountLink';

import type { Theme } from '../../design/themes';

export type Props = {
  accountLink: AccountLink,
  isFirst: boolean,
  onSelectAccountLink: () => any,
};

export const HEIGHT = 70;

export default class AccountLinkItem extends Component<Props> {
  render() {
    const { accountLink, isFirst } = this.props;
    const topBorder = isFirst ? { borderTopWidth: 1 } : null;
    return (
      <GetTheme>
        {(theme: Theme) => (
          <View
            key={accountLink.id}
            style={[
              styles.root,
              topBorder,
              {
                backgroundColor: theme.color.backgroundListItem,
                borderColor: theme.color.borderNormal,
              },
            ]}
          >
            <TouchableOpacity
              onPress={this.props.onSelectAccountLink}
              style={{ flex: 1 }}
            >
              <View style={styles.content}>
                <View style={styles.contentLeft}>
                  <Text style={theme.getTextStyleNormalWithEmphasis()}>
                    {accountLink.providerName}
                  </Text>
                  {this._renderAccountLinkNotice(theme, accountLink)}
                </View>
                <View style={styles.contentRight}>
                  {this._renderAccountLinkStatusIndicator(theme, accountLink)}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </GetTheme>
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
      <Text style={[styles.notice, theme.getTextStyleSmall()]}>{message}</Text>
    );
  }

  _renderAccountLinkStatusIndicator(theme: Theme, accountLink: AccountLink) {
    if (accountLink.isLinkFailure) {
      return <Image source={Icons.Error} style={styles.statusIndicator} />;
    }
    return <ActivityIndicator size="small" />;
  }
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 8,
  },

  contentLeft: {
    flex: 1,
  },

  contentRight: {
    marginRight: 4,
  },

  notice: {
    marginTop: 4,
  },

  root: {
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    flex: 1,
    marginHorizontal: 4,
  },

  statusIndicator: {},
});
