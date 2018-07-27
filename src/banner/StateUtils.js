/* @flow */

import type { Banner } from './types';
import type { ID } from 'common/types/core';
import type { ReduxState } from '../store';

function getBannerForID(reduxState: ReduxState, bannerID: ID): Banner | null {
  return (
    reduxState.banner.bannerQueue.find(banner => banner.id === bannerID) || null
  );
}

export default {
  getBannerForID,
};
