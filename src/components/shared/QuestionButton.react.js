/* @flow */

import Icons from '../../design/icons';
import React, { Component } from 'react';

import { Image, StyleSheet, TouchableOpacity } from 'react-native';

export type Props = {
  onPress: () => any,
};

export default class QuestionButton extends Component<Props> {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Image
          resizeMode="contain"
          source={Icons.Question}
          style={styles.icon}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    height: 20,
    width: 20,
  },
});
