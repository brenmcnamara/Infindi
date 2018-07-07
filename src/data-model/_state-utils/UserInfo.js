/* @flow */

import UserInfo from 'common/lib/models/UserInfo';

import { generateStateUtils } from './StateUtils';

import type { StateUtils as StateUtilsTemplate } from './StateUtils';
import type {
  UserInfoCollection,
  UserInfoRaw,
} from 'common/lib/models/UserInfo';

// eslint-disable-next-line flowtype/generic-spacing
export type StateUtils = StateUtilsTemplate<
  'UserInfo',
  UserInfoRaw,
  UserInfo,
  UserInfoCollection,
>;

export default generateStateUtils(UserInfo, reduxState => reduxState._userInfo);
