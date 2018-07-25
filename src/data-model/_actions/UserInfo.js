/* @flow */

import UserInfo from 'common/lib/models/UserInfo';

import {
  generateActionCreators,
  generateCreateCursor,
  generateCreateListener,
  generateCreateOperation,
} from './Actions';

import type { Action as ActionTemplate } from './Actions';
import type { ModelCursor, ModelListener, ModelOperation } from '../_types';
import type { ModelOrderedQuery, ModelQuery } from 'common/lib/models/Model';
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

type CreateCursor = (
  query: ModelOrderedQuery,
  pageSize: number,
) => ModelCursor<'UserInfo'>;

type CreateListener = (query: ModelQuery) => ModelListener<'UserInfo'>;

type CreateOperation = (query: ModelQuery) => ModelOperation<'UserInfo'>;

// $FlowFixMe - Template types are correct.
export const createCursor: CreateCursor = generateCreateCursor(UserInfo);
// $FlowFixMe - Template types are correct.
export const createListener: CreateListener = generateCreateListener(UserInfo);
// $FlowFixMe - Template types are correct.
export const createOperation: CreateOperation = generateCreateOperation(
  UserInfo,
);

export default generateActionCreators(UserInfo);
