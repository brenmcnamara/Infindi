/* @flow */

import type { ID } from 'common/types/core';
import type { PureAction } from '../store';

export type Toast = Toast$Banner;

export type BannerType = 'INFO' | 'ALERT' | 'SUCCESS';

export type BannerChannel = string;

export type Toast$Banner = {|
  +bannerChannel: BannerChannel,
  +bannerType: BannerType,
  +id: ID,
  +priority: 'LOW' | 'NORMAL' | 'HIGH',
  +showSpinner: boolean,
  +text: string,
  +toastType: 'BANNER',
|};

export type State = {
  +bannerQueue: Array<Toast$Banner>,
};

const DEFAULT_STATE = {
  bannerQueue: [],
};

export default function toast(
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
