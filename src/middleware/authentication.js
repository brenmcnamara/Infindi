/* @flow */

import { type Action, type Store } from '../types/redux';

export default (store: Store) => (next: Function) => {
  return (action: Action) => {
    return next(action);
  };
};
