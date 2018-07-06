/* @flow */

import UserInfo from 'common/lib/models/UserInfo';

import { generateReducer } from './Reducer';

import type { State as StateTemplate } from './Reducer';
import type { UserInfoRaw } from 'common/lib/models/UserInfo';

export type State = StateTemplate<'UserInfo', UserInfoRaw, UserInfo>;

export default generateReducer(UserInfo);
