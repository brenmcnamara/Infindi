/* @flow */

import Middleware from './Middleware';
import UserInfo from 'common/lib/models/UserInfo';
import UserInfoFetcher from 'common/lib/models/UserInfoFetcher';
import UserInfoMutator from 'common/lib/models/UserInfoMutator';

import type {
  UserInfoCollection,
  UserInfoOrderedCollection,
  UserInfoRaw,
} from 'common/lib/models/UserInfo';

export default class UserInfoMiddleware extends Middleware<
  'UserInfo',
  UserInfoRaw,
  UserInfo,
  UserInfoCollection,
  UserInfoOrderedCollection,
  typeof UserInfoFetcher,
  typeof UserInfoMutator,
> {
  static __ModelCtor = UserInfo;
  static __ModelFetcher = UserInfoFetcher;
  static __ModelMutator = UserInfoMutator;
}
