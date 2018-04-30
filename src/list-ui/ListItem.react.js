/* @flow */

import React, { Component } from 'react';

import { View } from 'react-native';

export type Props = {
  children?: ?any,
  height: number,
  index: number,
};


export default class ListItem extends Component<Props> {
  render() {
    return (
      <View style={{ height: this.props.height }}>{this.props.children}</View>
    );
  }
}
