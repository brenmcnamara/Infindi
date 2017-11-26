/* @flow */

import Colors from '../design/colors';
import Content from './shared/Content.react';
import Icons from '../design/icons';
import React, { Component } from 'react';
import Screen from './shared/Screen.react';
import TextDesign from '../design/text';

import { connect } from 'react-redux';
import { getUserFirstName } from '../store/state-utils';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { type ReduxProps } from '../types/redux';
import { type State } from '../reducers/root';

export type Props = ReduxProps & { firstName: string };

class SettingsScreen extends Component<Props> {
  render() {
    return (
      <Screen theme="LIGHT">
        <Content>
          {this._renderHeader()}
          {this._renderLogout()}
        </Content>
      </Screen>
    );
  }

  _renderHeader() {
    return (
      <View style={styles.header}>
        <Image
          resizeMode="contain"
          source={Icons.UserMale}
          style={[styles.iconLarge, styles.marginRight8]}
        />
        <Text style={TextDesign.header3}>{this.props.firstName}</Text>
      </View>
    );
  }

  _renderLogout() {
    return (
      <TouchableOpacity style={styles.listItem}>
        <Image
          resizeMode="contain"
          source={Icons.Power}
          style={[styles.iconMedium, styles.marginRight8]}
        />
        <Text style={TextDesign.normal}>Logout</Text>
      </TouchableOpacity>
    );
  }
}

const mapReduxStateToProps = (state: State) => ({
  firstName: getUserFirstName(state),
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
    height: 44, // Nav bar height
    marginTop: 20, // Status bar height,
    paddingLeft: 24 - ICON_WIDTH_LARGE / 2,
  },

  iconLarge: {
    width: ICON_WIDTH_LARGE,
  },

  iconMedium: {
    width: ICON_WIDTH_NORMAL,
  },

  listItem: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 24 - ICON_WIDTH_NORMAL / 2,
    paddingVertical: 8,
  },

  marginRight8: {
    marginRight: 8,
  },
});
