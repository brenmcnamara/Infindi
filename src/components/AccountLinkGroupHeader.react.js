/* @flow */

import React, { Component } from 'react';

import { GetTheme } from '../design/components/Theme.react';
import { StyleSheet, Text, View } from 'react-native';

import type { Theme } from '../design/themes';

export type Props = {};

export const HEIGHT = 50;

export default class AccountLinkGroupHeader extends Component<Props> {
  render() {
    return (
      <GetTheme>
        {(theme: Theme) => (
          <View style={styles.root}>
            <View
              style={[
                styles.content,
                { borderColor: theme.color.borderNormal },
              ]}
            >
              <Text
                style={[styles.text, theme.getTextStyleNormalWithEmphasis()]}
              >
                ACCOUNT LINKS
              </Text>
            </View>
          </View>
        )}
      </GetTheme>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    borderBottomWidth: 1,
    marginBottom: 4,
    paddingBottom: 4,
    paddingHorizontal: 8,
  },

  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  text: {},
});
