/* @flow */

import Icons from '../../design/icons';
import React, { Component } from 'react';

import { Image, TouchableOpacity } from 'react-native';

export type Props = {
  onPress: () => any,
};

export default class InfoButton extends Component<Props> {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Image source={Icons.Info} />
      </TouchableOpacity>
    );
  }
}
