/* @flow */

import uuid from 'uuid/v1';

import invariant from 'invariant';

import { Animated, Easing } from 'react-native';

import type { ElementRef } from 'react';
import type { ID } from 'common/types/core';

export type ListAnimationManagerOptions = {
  animateOnMount: boolean,
  mountingDelayToNextItemMillis: number,
  mountingDurationPerItemMillis: number,
  transitionDurationPerItemMillis: number,
};

type ElementPayload = {
  element: ElementRef<*>,
  height: number,
  index: number,
  transitionValue: Animated.Value,
};

const DEFAULT_OPTIONS = {
  animateOnMount: true,
  mountingDelayToNextItemMillis: 35,
  mountingDurationPerItemMillis: 200,
  transitionDurationPerItemMillis: 400,
};

export default class ListAnimationManager {
  _elementPayloads: { [id: ID]: ElementPayload } = {};
  _isListMounted: boolean = false;
  _mountingAnimatedValue = new Animated.Value(0);
  _options: ListAnimationManagerOptions;

  constructor(options: ListAnimationManagerOptions | null = null) {
    this._options = { ...DEFAULT_OPTIONS, ...options };
  }

  register(element: ElementRef<*>, index: number, height: number): ID {
    const id = uuid();
    this._elementPayloads[id] = {
      element,
      height,
      index,
      transitionValue: new Animated.Value(this._isListMounted ? 0 : 1),
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

  itemDidMount(id: ID): void {
    if (!this._isListMounted) {
      return;
    }
    const {transitionValue} = this._getPayload(id);
    Animated.timing(transitionValue, {
      duration: this._options.transitionDurationPerItemMillis,
      easing: Easing.out(Easing.cubic),
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }

  listDidMount(): void {
    invariant(!this._isListMounted, 'Mounting the list multiple times');
    this._isListMounted = true;

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

  getTransitionValue(id: ID): Animated.Value {
    return this._getPayload(id).transitionValue;
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
    invariant(payload, 'Cannot find payload for list item: %s', id);
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
