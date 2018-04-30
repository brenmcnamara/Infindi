/* @flow */

import React, { Component } from 'react';

import { Animated, Easing } from 'react-native';

export type Props = {
  children?: ?any,
  height: number,
  index: number,
  initializeStart: number,
  initializeTransition: Animated.Value,
  isListInitializing: boolean,
  onAddTransitionComplete: () => void,
  onRemoveTransitionComplete: () => void,
};

const TRANSITION_INSERT_OR_REMOVE_DURATION_MS = 500;
const TRANSITION_INSERT_OR_REMOVE_EASING = Easing.out(Easing.cubic);

export default class ListItem extends Component<Props> {
  _addOrRemoveTransition = new Animated.Value(0);

  componentWillMount(): void {
    if (this.props.isListInitializing) {
      this._addOrRemoveTransition.setValue(1);
    }
  }

  componentDidMount(): void {
    if (!this.props.isListInitializing) {
      // TODO: Not sure why I need to defer the animation with this timeout,
      // but I should probably submit an issue to react native.
      setTimeout(() => {
        Animated.timing(this._addOrRemoveTransition, {
          duration: TRANSITION_INSERT_OR_REMOVE_DURATION_MS,
          easing: TRANSITION_INSERT_OR_REMOVE_EASING,
          toValue: 1,
        }).start(this.props.onAddTransitionComplete);
      }, 0);
    }
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (React.Children.count(nextProps.children) === 0) {
      Animated.timing(this._addOrRemoveTransition, {
        duration: TRANSITION_INSERT_OR_REMOVE_DURATION_MS,
        easing: TRANSITION_INSERT_OR_REMOVE_EASING,
        toValue: 0,
      }).start(nextProps.onRemoveTransitionComplete);
    }
  }

  render() {
    const { initializeStart, initializeTransition } = this.props;
    const outerStyles = {
      opacity: initializeTransition.interpolate({
        inputRange: [0, Math.min(1, initializeStart), 1],
        outputRange: [0, 0, 1],
      }),
      transform: [
        {
          translateY: initializeTransition.interpolate({
            inputRange: [0, Math.min(1, initializeStart), 1],
            outputRange: [-20, -20, 0],
          }),
        },
      ],
    };

    const innerStyles = {
      height: this._addOrRemoveTransition.interpolate({
        inputRange: [0, 1],
        outputRange: [0, this.props.height],
      }),
      opacity: this._addOrRemoveTransition.interpolate({
        inputRange: [0, 0.3, 1],
        outputRange: [0, 0, 1],
      }),
      transform: [
        {
          translateX: this._addOrRemoveTransition.interpolate({
            inputRange: [0, 1],
            outputRange: [-40, 0],
          }),
        },
      ],
    };

    return (
      <Animated.View style={outerStyles}>
        <Animated.View style={innerStyles}>{this.props.children}</Animated.View>
      </Animated.View>
    );
  }
}
