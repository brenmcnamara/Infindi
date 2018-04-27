/* @flow */

import React, { Component } from 'react';

import { Animated } from 'react-native';

import type ListItemAnimationManager from './ListItemAnimationManager';

export type Props = {
  animationManager: ListItemAnimationManager,
  children?: ?any,
  index: number,
};

export default class ListItem extends Component<Props> {
  componentWillMount(): void {
    this.props.animationManager.register(this, this.props.index);
  }

  render() {
    return this.props.children;
  }
}
