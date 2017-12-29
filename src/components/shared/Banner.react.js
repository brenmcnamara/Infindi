/* @flow */

import Colors from '../../design/colors';
import React, { Component } from 'react';
import TextDesign from '../../design/text';

import { Animated, StyleSheet } from 'react-native';

export type BannerType = 'INFO';

export type Props = {
  show: bool,
  text: string,
  type: BannerType,
};

const BANNER_HEIGHT = 22; // TEXT LINE HEIGHT

export default class Banner extends Component<Props> {
  _height: Animated.Value;

  constructor(props: Props) {
    super(props);
    this._height = new Animated.Value(props.show ? BANNER_HEIGHT : 0);
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.show !== this.props.show) {
      Animated.timing(this._height, {
        duration: 400,
        toValue: nextProps.show ? 22 : 0,
      }).start();
    }
  }

  render() {
    const rootStyles = {
      height: this._height,
      backgroundColor: Colors.BANNER_BACKGROUND_INFO,
    };

    const textStyles = [
      TextDesign.smallWithEmphasis,
      styles.text,
      { color: Colors.BANNER_TEXT_INFO, height: this._height },
    ];
    return (
      <Animated.View style={rootStyles}>
        <Animated.Text style={textStyles}>{this.props.text}</Animated.Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
});
