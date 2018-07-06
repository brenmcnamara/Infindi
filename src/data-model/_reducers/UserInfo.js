/* @flow */

import UserInfo from 'common/lib/models/UserInfo';

import { generateReducer } from './Reducer';

import type { State as StateTemplate } from './Reducer';
import type {
  UserInfoCollection,
  UserInfoRaw,
} from 'common/lib/models/UserInfo';

// eslint-disable-next-line flowtype/generic-spacing
export type State = StateTemplate<
  'UserInfo',
  UserInfoRaw,
  UserInfo,
  UserInfoCollection,
>;

export default generateReducer(UserInfo);
