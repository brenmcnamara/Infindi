/* @flow */

import invariant from 'invariant';

import type { Banner } from './types';
import type { Next, PureAction, StoreType } from '../store';

export type Action = Action$UpdateBannerQueue;

export type Action$UpdateBannerQueue = {|
  +bannerQueue: Array<Banner>,
  +type: 'UPDATE_BANNER_QUEUE',
|};

export default (store: StoreType) => (next: Next) => {
  let bannerQueue: Array<Banner> = [];

  return (action: PureAction) => {
    next(action);

    switch (action.type) {
      case 'REQUEST_BANNER': {
        const { banner } = action;
        const newQueue = addBannerToPriorityQueue(banner, bannerQueue);
        bannerQueue = newQueue;
        next({
          bannerQueue: newQueue,
          type: 'UPDATE_BANNER_QUEUE',
        });
        break;
      }

      case 'REQUEST_MULTIPLE_BANNERS': {
        const { banners } = action;
        if (banners.length === 0) {
          break;
        }
        let newQueue = bannerQueue;
        banners.forEach(banner => {
          newQueue = addBannerToPriorityQueue(banner, newQueue);
        });
        next({
          bannerQueue: newQueue,
          type: 'UPDATE_BANNER_QUEUE',
        });
        break;
      }

      case 'DISMISS_BANNER': {
        const { bannerID } = action;

        const newQueue = bannerQueue.slice();
        const index = bannerQueue.findIndex(banner => banner.id === bannerID);

        if (index < 0 && !action.shouldThrowOnDismissingNonExistantToast) {
          break;
        }

        invariant(
          index >= 0,
          'Trying to dismiss toast that is not in queue: %s',
          bannerID,
        );
        newQueue.splice(index, 1);
        bannerQueue = newQueue;
        next({
          bannerQueue: newQueue,
          type: 'UPDATE_BANNER_QUEUE',
        });
        break;
      }
    }
  };
};

function addBannerToPriorityQueue(
  banner: Banner,
  queue: Array<Banner>,
): Array<Banner> {
  const newQueue = queue.slice();
  // First check if there is a banner with the same id. If so, we need to
  // remove that banner before adding this one.
  const bannerIndex = newQueue.findIndex(_banner => banner.id === _banner.id);
  if (bannerIndex >= 0) {
    newQueue.splice(bannerIndex, 1);
  }
  for (let i = 0; i < queue.length; ++i) {
    if (hasHigherPriority(banner, queue[i])) {
      newQueue.splice(i, 0, banner);
      return newQueue;
    }
  }
  newQueue.push(banner);
  return newQueue;
}

const PriorityToNum = {
  HIGH: 3,
  NORMAL: 2,
  LOW: 1,
};

function hasHigherPriority(banner1: Banner, banner2: Banner): boolean {
  const num1 = PriorityToNum[banner1.priority];
  const num2 = PriorityToNum[banner2.priority];
  return num1 > num2;
}
