/* @flow */

import Icons from '../../design/icons';
import React, { Component } from 'react';

import { Animated, Easing, Image, StyleSheet, View } from 'react-native';

export type Props = {};

export const HEIGHT = 30;
export const WIDTH = 30;

export default class Downloading extends Component<Props> {
  _spinnerProgress: Animated.Value = new Animated.Value(0);

  componentDidMount(): void {
    this._startSpinner();
  }

  render() {
    const spinnerStyles = [
      {
        transform: [
          {
            rotateZ: this._spinnerProgress.interpolate({
              inputRange: [0, 1],
              outputRange: ['0rad', '6.28318rad'],
            }),
          },
        ],
      },
      styles.spinner,
    ];
    return (
      <View style={styles.root}>
        <Animated.Image
          resizeMode="contain"
          source={Icons.OpenCircle}
          style={spinnerStyles}
        />
        <Image
          resizeMode="contain"
          source={Icons.Download}
          style={styles.downloadIcon}
        />
      </View>
    );
  }

  _startSpinner = (): void => {
    this._spinnerProgress.setValue(0);
    Animated.timing(this._spinnerProgress, {
      duration: 1500,
      easing: Easing.linear,
      toValue: 1.0,
    }).start(this._startSpinner);
  };
}

const styles = StyleSheet.create({
  downloadIcon: {
    left: (WIDTH - 15) / 2,
    height: 15,
    position: 'absolute',
    top: (HEIGHT - 15) / 2,
    width: 15,
  },

  root: {
    height: HEIGHT,
    width: WIDTH,
  },

  spinner: {
    height: HEIGHT,
    left: 0,
    position: 'absolute',
    top: 0,
    width: WIDTH,
  },
});
