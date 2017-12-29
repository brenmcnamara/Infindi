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

/**
 * Enumerate the key / value pairs of an object, and map the returns value of
 * the enumeration function into an array.
 */
export function mapObjectToArray<T, K: string, V>(
  obj: Obj<K, V>,
  cb: ObjectEnumeratorFn<T, K, V>,
): Array<T> {
  const values = [];
  let i = 0;
  // $FlowFixMe - Assumption of reasonable object implementation.
  for (let key: K in obj) {
    if (obj.hasOwnProperty(key)) {
      const val: V = obj[key];
      values.push(cb(val, key, i));
      ++i;
    }
  }
  return values;
}

/**
 * Enumerate the key . value pairs of an object and filter our values in the
 * object.
 */
export function filterObject<K: string, V>(
  obj: Obj<K, V>,
  predicate: ObjectEnumeratorFn<any, K, V>,
): Obj<K, V> {
  const newObj = {};
  let i = 0;
  // $FlowFixMe - Assumption of reasonable object implementation.
  for (let key: K in obj) {
    if (obj.hasOwnProperty(key) && predicate(obj[key], key, i)) {
      const val: V = obj[key];
      newObj[key] = val;
      ++i;
    }
  }
  return newObj;
}

/**
 * Enumerate the key / value pairs of an object and reduce them to a single
 * value.
 */
export function reduceObject<T, K: string, V>(
  obj: Obj<K, V>,
  cb: ObjectReducerFn<T, K, V>,
  initial: T,
): T {
  let result = initial;
  let i = 0;
  // $FlowFixMe - Assumption of reasonable object implementation.
  for (let key: K in obj) {
    if (obj.hasOwnProperty(key)) {
      const val: V = obj[key];
      result = cb(result, val, key, i);
      ++i;
    }
  }

  return result;
}

/**
 * Get the values of the object as an array.
 */
export function getValues<V>(obj: Obj<*, V>): Array<V> {
  if (Object.values) {
    // $FlowFixMe - This is fine.
    return Object.values(obj);
  }
  let values = [];
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      values.push(obj[prop]);
    }
  }
  return values;
}

export function isObjectEmpty(obj: Obj<*, *>): bool {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}
