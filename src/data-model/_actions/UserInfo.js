/* @flow */

import UserInfo from 'common/lib/models/UserInfo';

import {
  generateActionCreators,
  generateCreateCursor,
  generateCreateListener,
} from './Actions';

import type { Action as ActionTemplate } from './Actions';
import type { ModelCursor, ModelListener, ModelQuery } from '../_types';
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

type CreateCursor = (query: ModelQuery) => ModelCursor<'UserInfo'>;
type CreateListener = (query: ModelQuery) => ModelListener<'UserInfo'>;

// $FlowFixMe - Template types are correct.
export const createCursor: CreateCursor = generateCreateCursor(UserInfo);
// $FlowFixMe - Template types are correct.
export const createListener: CreateListener = generateCreateListener(UserInfo);

export default generateActionCreators(UserInfo);