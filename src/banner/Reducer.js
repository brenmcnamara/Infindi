/* @flow */

import type { Banner } from './types';
import type { PureAction } from '../store';

export type State = {
  +bannerQueue: Array<Banner>,
};

const DEFAULT_STATE = {
  bannerQueue: [],
};

export default function banner(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'UPDATE_BANNER_QUEUE': {
      return { ...state, bannerQueue: action.bannerQueue };
    }
  }
  return state;
}
