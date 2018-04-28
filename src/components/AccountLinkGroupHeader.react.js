/* @flow */

import React, { Component } from 'react';

import { GetTheme } from '../design/components/Theme.react';
import { StyleSheet, Text, View } from 'react-native';

import type { Theme } from '../design/themes';

export type Props = {};

export const HEIGHT = 30;

export default class AccountLinkGroupHeader extends Component<Props> {
  render() {
    return (
      <GetTheme>
        {(theme: Theme) => (
          <View
            style={[styles.root, { borderColor: theme.color.borderNormal }]}
          >
            <Text style={[styles.text, theme.getTextStyleNormalWithEmphasis()]}>
              ACCOUNT LINKS
            </Text>
          </View>
        )}
      </GetTheme>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    borderBottomWidth: 1,
    height: HEIGHT,
    marginBottom: 4,
    marginTop: 16,
    paddingBottom: 4,
    paddingHorizontal: 8,
  },

  text: {},
});
