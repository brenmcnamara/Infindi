/* @flow */

import Content from './shared/Content.react';
import Icons from '../design/icons';
import IfAuthenticated from './shared/IfAuthenticated.react';
import React, { Component } from 'react';
import Screen from './shared/Screen.react';

import { connect } from 'react-redux';
import { GetTheme } from '../design/components/Theme.react';
import { getUserFirstName } from '../auth/state-utils';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { logout } from '../auth/actions';

import type { ReduxProps } from '../typesDEPRECATED/redux';
import type { State } from '../reducers/root';
import type { Theme } from '../design/themes';

export type Props = ReduxProps & { firstName: string };

class SettingsScreen extends Component<Props> {
  render() {
    return (
      <GetTheme>
        {theme => (
          <Screen theme="LIGHT">
            <IfAuthenticated>
              <Content>
                {this._renderHeader(theme)}
                {this._renderLogout(theme)}
              </Content>
            </IfAuthenticated>
          </Screen>
        )}
      </GetTheme>
    );
  }

  _renderHeader(theme: Theme) {
    return (
      <View style={[styles.header, { borderColor: theme.color.borderNormal }]}>
        <Image
          resizeMode="contain"
          source={Icons.UserMale}
          style={[styles.iconLarge, styles.iconToTextSpacing]}
        />
        <Text style={theme.getTextStyleHeader3()}>{this.props.firstName}</Text>
      </View>
    );
  }

  _renderLogout(theme: Theme) {
    return (
      <TouchableOpacity onPress={this._onPressLogout} style={styles.listItem}>
        <Image
          resizeMode="contain"
          source={Icons.Power}
          style={[styles.iconMedium, styles.iconToTextSpacing]}
        />
        <Text style={theme.getTextStyleNormal()}>Logout</Text>
      </TouchableOpacity>
    );
  }

  _onPressLogout = (): void => {
    this.props.dispatch(logout());
  };
}

const mapReduxStateToProps = (state: State) => ({
  firstName: getUserFirstName(state) || '',
});

export default connect(mapReduxStateToProps)(SettingsScreen);

const ICON_WIDTH_LARGE = 30;
const ICON_WIDTH_NORMAL = 15;

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 64,
    marginTop: 20, // Status bar height,
    paddingLeft: 24 - ICON_WIDTH_LARGE / 2,
  },

  iconLarge: {
    width: ICON_WIDTH_LARGE,
  },

  iconMedium: {
    width: ICON_WIDTH_NORMAL,
  },

  iconToTextSpacing: {
    marginRight: 16,
  },

  listItem: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 24 - ICON_WIDTH_NORMAL / 2,
    paddingVertical: 8,
  },
});
