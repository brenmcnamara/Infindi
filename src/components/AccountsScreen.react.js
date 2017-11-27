/* @flow */

import Content from './shared/Content.react';
import Icons from '../design/icons';
import React, { Component } from 'react';
import Screen from './shared/Screen.react';
import TextDesign from '../design/text';

import { AccountNullState } from '../../content';
import { connect } from 'react-redux';
import { Image, StyleSheet, Text, View } from 'react-native';

import { type ReduxProps } from '../types/redux';

export type Props = ReduxProps & {};

class AccountsScreen extends Component<Props> {
  render() {
    return <Screen>{this._renderNullState()}</Screen>;
  }

  _renderNullState() {
    return (
      <Content>
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
              {AccountNullState}
            </Text>
          </View>
        </View>
      </Content>
    );
  }
}

function mapReduxStateToProps() {
  return {};
}

export default connect(mapReduxStateToProps)(AccountsScreen);

const styles = StyleSheet.create({
  bankIcon: {
    marginBottom: 40,
    width: 123,
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
