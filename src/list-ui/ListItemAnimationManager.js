/* @flow */

import uuid from 'uuid/v1';

import invariant from 'invariant';

import { Animated, Easing } from 'react-native';

import type { ElementRef } from 'react';
import type { ID } from 'common/types/core';

export type ListItemAnimationManagerOptions = {
  animateOnMount: boolean,
  mountingDelayToNextItemMillis: number,
  mountingDurationPerItemMillis: number,
};

type ElementPayload = {
  element: ElementRef<*>,
  index: number,
};

const DEFAULT_OPTIONS = {
  animateOnMount: true,
  mountingDelayToNextItemMillis: 35,
  mountingDurationPerItemMillis: 200,
};

export default class ListItemAnimationManager {
  _elementPayloads: { [id: ID]: ElementPayload } = {};
  _isMounted: boolean = false;
  _mountingAnimatedValue = new Animated.Value(0);
  _options: ListItemAnimationManagerOptions;

  constructor(options: ListItemAnimationManagerOptions | null = null) {
    this._options = { ...DEFAULT_OPTIONS, ...options };
  }

  register(element: ElementRef<*>, index: number): ID {
    const id = uuid();
    this._elementPayloads[id] = {
      element,
      index,
    };
    return id;
  }

  unregister(id: ID): void {
    invariant(
      this._elementPayloads[id],
      'Trying to unregister a ListItem from the AnimationManager that does not exist: %s',
      id,
    );
    delete this._elementPayloads[id];
  }

  listDidMount(): void {
    invariant(!this._isMounted, 'Mounting the list multiple times');
    this._isMounted = true;

    const duration = this._getTotalMountingDurationMillis();
    Animated.timing(this._mountingAnimatedValue, {
      duration,
      easing: Easing.out(Easing.poly(5)),
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }

  getMountingAnimatedValue(): Animated.Value {
    return this._mountingAnimatedValue;
  }

  getMountingDelayRatio(id: ID): number {
    const duration = this._getTotalMountingDurationMillis();
    const { mountingDelayToNextItemMillis } = this._options;
    const startTime =
      mountingDelayToNextItemMillis * this._getPayload(id).index;

    return startTime / duration;
  }

  _getPayload(id: ID): ElementPayload {
    const payload = this._elementPayloads[id];
    invariant(payload, 'Cannot find mounting animation for element: %s', id);
    return payload;
  }

  _getTotalMountingDurationMillis(): number {
    const count = Object.keys(this._elementPayloads).length;
    const {
      mountingDelayToNextItemMillis,
      mountingDurationPerItemMillis,
    } = this._options;
    return (
      (count - 1) * mountingDelayToNextItemMillis +
      mountingDurationPerItemMillis
    );
  }
}
