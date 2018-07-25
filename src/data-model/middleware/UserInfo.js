/* @flow */

import Middleware from './Middleware';
import UserInfo from 'common/lib/models/UserInfo';

import type {
  UserInfoCollection,
  UserInfoRaw,
} from 'common/lib/models/UserInfo';

export default class UserInfoMiddleware extends Middleware<
  'UserInfo',
  UserInfoRaw,
  UserInfo,
  UserInfoCollection,
> {
  static __ModelCtor = UserInfo;
}
