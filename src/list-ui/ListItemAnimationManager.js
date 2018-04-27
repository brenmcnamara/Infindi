/* @flow */

import uuid from 'uuid/v1';

import { Animated } from 'react-native';

import invariant from 'invariant';

import type { ElementRef } from 'react';
import type { ID } from 'common/types/core';

export type ListItemAnimationManagerOptions = {
  animateOnMount: boolean,
};

type ElementPayload = {
  element: ElementRef<*>,
  index: number,
};

const DEFAULT_OPTIONS = {
  animateOnMount: true,
};

export default class ListItemAnimationManager {
  _elements: { [id: ID]: ElementPayload } = {};
  _options: ListItemAnimationManagerOptions;

  constructor(options: ListItemAnimationManagerOptions | null = null) {
    this._options = { ...DEFAULT_OPTIONS, ...options };
  }

  register(element: ElementRef<*>, index: number): ID {
    const id = uuid();
    this._elements[id] = {
      element,
      index,
    };
    return id;
  }

  unregister(id: ID): void {
    invariant(
      this._elements[id],
      'Trying to unregister a ListItem from the AnimationManager that does not exist: %s',
      id,
    );
    delete this._elements[id];
  }

  listDidMount(): void {}

  getAnimatedValue(id: ID): Animated.Value {
    return new Animated.Value(1.0);
  }
}
