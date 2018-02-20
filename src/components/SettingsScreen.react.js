/* @flow */

import Colors from '../design/colors';
import Content from './shared/Content.react';
import Icons from '../design/icons';
import IfAuthenticated from './shared/IfAuthenticated.react';
import React, { Component } from 'react';
import Screen from './shared/Screen.react';
import TextDesign from '../design/text';

import { connect } from 'react-redux';
import { getUserFirstName } from '../common/state-utils';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { logout } from '../actions/authentication';

import { type ReduxProps } from '../typesDEPRECATED/redux';
import { type State } from '../reducers/root';

export type Props = ReduxProps & { firstName: string };

class SettingsScreen extends Component<Props> {
  render() {
    return (
      <Screen theme="LIGHT">
        <IfAuthenticated>
          <Content>
            {this._renderHeader()}
            {this._renderLogout()}
          </Content>
        </IfAuthenticated>
      </Screen>
    );
  }

  _renderHeader() {
    return (
      <View style={styles.header}>
        <Image
          resizeMode="contain"
          source={Icons.UserMale}
          style={[styles.iconLarge, styles.iconToTextSpacing]}
        />
        <Text style={TextDesign.header3}>{this.props.firstName}</Text>
      </View>
    );
  }

  _renderLogout() {
    return (
      <TouchableOpacity onPress={this._onPressLogout} style={styles.listItem}>
        <Image
          resizeMode="contain"
          source={Icons.Power}
          style={[styles.iconMedium, styles.iconToTextSpacing]}
        />
        <Text style={TextDesign.normal}>Logout</Text>
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
    borderColor: Colors.BORDER,
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
