/* @flow */

import React, { Component } from 'react';

import invariant from 'invariant';

import { Animated } from 'react-native';

import type ListAnimationManager from './ListAnimationManager';

import type { ID } from 'common/types/core';

export type Props = {
  animationManager: ListAnimationManager,
  children?: ?any,
  height: number,
  index: number,
};

export default class ListItem extends Component<Props> {
  _id: ID;

  componentWillMount(): void {
    const { animationManager, height, index } = this.props;
    this._id = animationManager.register(this, index, height);
  }

  componentDidMount(): void {
    this.props.animationManager.itemDidMount(this._id);
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

    const transitionValue = animationManager.getTransitionValue(this._id);
    const transitionStyles = {
      opacity: transitionValue,
    };

    return (
      <Animated.View style={mountingStyles}>
        <Animated.View style={transitionStyles}>
          {this.props.children}
        </Animated.View>
      </Animated.View>
    );
  }
}
