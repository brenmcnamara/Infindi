/* @flow */

import invariant from 'invariant';

import type { Next, PureAction, Store } from '../typesDEPRECATED/redux';
import type { Toast$Banner } from '../reducers/toast';

export type Action = Action$UpdateBannerQueue;

export type Action$UpdateBannerQueue = {|
  +bannerQueue: Array<Toast$Banner>,
  +type: 'UPDATE_BANNER_QUEUE',
|};

export default (store: Store) => (next: Next) => {
  let bannerQueue: Array<Toast$Banner> = [];

  return (action: PureAction) => {
    next(action);

    switch (action.type) {
      case 'REQUEST_TOAST': {
        const { toast } = action;
        invariant(
          toast.toastType === 'BANNER',
          'Toast middleware only supports banners: %s',
          toast.toastType,
        );
        const newQueue = addBannerToPriorityQueue(toast, bannerQueue);
        bannerQueue = newQueue;
        next({
          bannerQueue: newQueue,
          type: 'UPDATE_BANNER_QUEUE',
        });
        break;
      }

      case 'DISMISS_TOAST': {
        const { toastID } = action;

        const newQueue = bannerQueue.slice();
        const index = bannerQueue.findIndex(banner => banner.id === toastID);
        invariant(
          index >= 0,
          'Trying to dismiss toast that is not in queue: %s',
          toastID,
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
  banner: Toast$Banner,
  queue: Array<Toast$Banner>,
): Array<Toast$Banner> {
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

function hasHigherPriority(
  banner1: Toast$Banner,
  banner2: Toast$Banner,
): bool {
  const num1 = PriorityToNum[banner1.priority];
  const num2 = PriorityToNum[banner2.priority];
  return num1 > num2;
}
