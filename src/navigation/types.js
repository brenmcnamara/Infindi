/* @flow */

import type { ComponentType } from 'react';

export type ScreenPayload = {
  +component: ComponentType<*>,
  +screen: string,
};

export type Transition<T> =
  | { +current: T, +type: 'NOT_TRANSITIONING' }
  | { +from: T, +to: T, +type: 'TRANSITIONING' };
