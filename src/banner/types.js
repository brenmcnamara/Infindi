/* @flow */

import type { ID } from 'common/types/core';

export type Banner = {|
  +bannerChannel: BannerChannel,
  +bannerType: BannerType,
  +id: ID,
  +priority: 'LOW' | 'NORMAL' | 'HIGH',
  +showSpinner: boolean,
  +text: string,
|};

export type BannerType = 'INFO' | 'ALERT' | 'SUCCESS';

export type BannerChannel = string;
