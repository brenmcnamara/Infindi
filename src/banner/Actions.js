/* @flow */

import type { Banner } from './types';
import type { ID } from 'common/types/core';

export type Action =
  | Action$RequestMultipleBanners
  | Action$RequestBanner
  | Action$DismissBanner;

export type Action$RequestBanner = {|
  +banner: Banner,
  +type: 'REQUEST_BANNER',
|};

export function requestBanner(banner: Banner): Action$RequestBanner {
  return {
    banner,
    type: 'REQUEST_BANNER',
  };
}

export type Action$RequestMultipleBanners = {|
  +banners: Array<Banner>,
  +type: 'REQUEST_MULTIPLE_BANNERS',
|};

export function requestMultipleBanners(
  banners: Array<Banner>,
): Action$RequestMultipleBanners {
  return {
    banners,
    type: 'REQUEST_MULTIPLE_BANNERS',
  };
}

export type Action$DismissBanner = {|
  +shouldThrowOnDismissingNonExistantBanner: boolean,
  +bannerID: ID,
  +type: 'DISMISS_BANNER',
|};

export function dismissBanner(
  bannerID: ID,
  shouldThrowOnDismissingNonExistantBanner: boolean = true,
): Action$DismissBanner {
  return {
    bannerID,
    shouldThrowOnDismissingNonExistantBanner,
    type: 'DISMISS_BANNER',
  };
}
