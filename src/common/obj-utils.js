/* @flow */

/**
 * This file contains utilities for processing and manipulating objects. The
 * goal of this is to come up with a set of utilities for raw json objects that:
 *
 * (1) Works well with React
 * (2) Do not require creating new classes or types, everything is JSON
 * (3) Maintains immutability
 */

export type Obj<K: string, V> = { [key: K]: V };

export type ObjectEnumeratorFn<TReturn, K: string, V> = (
  V,
  K,
  number,
) => TReturn;

export type ObjectReducerFn<TMemo, K: string, V> = (
  TMemo,
  V,
  K,
  number,
) => TMemo;

export function forEachObject<K: string, V>(
  obj: Obj<K, V>,
  cb: ObjectEnumeratorFn<any, K, V>,
): void {
  let i = 0;
  // $FlowFixMe - Assumption of reasonable object implementation.
  for (let key: K in obj) {
    if (obj.hasOwnProperty(key)) {
      cb(obj[key], key, i);
      ++i;
    }
  }
}
