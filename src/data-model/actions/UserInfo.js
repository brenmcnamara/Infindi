/* @flow */

import UserInfo from 'common/lib/models/UserInfo';

import { generateActionCreators } from './Actions';

import type { Action as ActionTemplate } from './Actions';
import type {
  UserInfoCollection,
  UserInfoRaw,
} from 'common/lib/models/UserInfo';

// eslint-disable-next-line flowtype/generic-spacing
export type Action = ActionTemplate<
  'UserInfo',
  UserInfoRaw,
  UserInfo,
  UserInfoCollection,
>;

export default generateActionCreators(UserInfo);
