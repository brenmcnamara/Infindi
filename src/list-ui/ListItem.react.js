/* @flow */

import React, { Component } from 'react';

import invariant from 'invariant';

import { Animated } from 'react-native';

import type ListItemAnimationManager from './ListItemAnimationManager';

import type { ID } from 'common/types/core';

export type Props = {
  animationManager: ListItemAnimationManager,
  children?: ?any,
  index: number,
};

export default class ListItem extends Component<Props> {
  _id: ID;

  componentWillMount(): void {
    this._id = this.props.animationManager.register(this, this.props.index);
  }

  componentWillReceiveProps(nextProps: Props): void {
    invariant(
      this.props.animationManager === nextProps.animationManager,
      'Cannot change the animation manager of a list item',
    );
  }

  render() {
    const { animationManager } = this.props;
    const mountingValue = animationManager.getMountingAnimatedValue();
    const delayRatio = animationManager.getMountingDelayRatio(this._id);
    const mountingStyles = {
      opacity: mountingValue.interpolate({
        inputRange: [0, delayRatio, 1],
        outputRange: [0, 0, 1],
      }),
      transform: [
        {
          translateY: mountingValue.interpolate({
            inputRange: [0, delayRatio, 1],
            outputRange: [20, 20, 0],
          }),
        },
      ],
    };

    return (
      <Animated.View style={mountingStyles}>
        {this.props.children}
      </Animated.View>
    );
  }
}
