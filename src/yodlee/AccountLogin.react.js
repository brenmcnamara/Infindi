/* @flow */

import Colors from '../design/colors';
import Icons from '../design/icons';
import React, { Component } from 'react';

import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { NavBarHeight } from '../design/layout';

import type { Provider as YodleeProvider } from 'common/lib/models/YodleeProvider';

export type Props = {
  onBack: () => any,
  provider: YodleeProvider,
};

export default class AccountLogin extends Component<Props> {
  render() {
    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <TouchableOpacity onPress={this._onPressHeaderLeftIcon}>
            <Image
              resizeMode="contain"
              source={Icons.LeftArrow}
              style={styles.headerLeftIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _onPressHeaderLeftIcon = (): void => {
    this.props.onBack();
  };
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.BORDER_HAIRLINE,
    flexDirection: 'row',
    height: NavBarHeight,
  },

  headerLeftIcon: {
    marginLeft: 16,
  },

  root: {
    backgroundColor: Colors.BACKGROUND,
    flex: 1,
  },
});
