/* @flow */

import React, { Component } from 'react';

import { GetTheme } from '../design/components/Theme.react';
import { StyleSheet, View } from 'react-native';

export type Props = {
  children?: ?any,
  // TODO: What is the proper typing for this?
  style?: any,
};

export default class Footer extends Component<Props> {
  render() {
    return (
      <GetTheme>
        {theme => (
          <View
            style={[
              styles.root,
              { borderColor: theme.color.borderNormal },
              this.props.style,
            ]}
          >
            {this.props.children}
          </View>
        )}
      </GetTheme>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    borderTopWidth: 1,
    height: 50,
  },
});
