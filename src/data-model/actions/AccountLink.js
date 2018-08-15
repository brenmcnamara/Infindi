/* @flow */

import AccountLink from 'common/lib/models/AccountLink';

import {
  generateActionCreators,
  generateCreateCursor,
  generateCreateListener,
  generateCreateOperation,
} from './Actions';

import type {
  AccountLinkCollection,
  AccountLinkRaw,
} from 'common/lib/models/AccountLink';
import type { Action as ActionTemplate } from './Actions';
import type {
  ModelCollectionQuery,
  ModelOrderedCollectionQuery,
} from 'common/lib/models/Model';
import type { ModelCursor, ModelListener, ModelOperation } from '../types';

// eslint-disable-next-line flowtype/generic-spacing
export type Action = ActionTemplate<
  'AccountLink',
  AccountLinkRaw,
  AccountLink,
  AccountLinkCollection,
>;

type CreateCursor = (
  query: ModelOrderedCollectionQuery,
  pageSize: number,
) => ModelCursor<'AccountLink'>;

type CreateListener = (
  query: ModelCollectionQuery,
) => ModelListener<'AccountLink'>;

type CreateOperation = (
  query: ModelCollectionQuery,
) => ModelOperation<'AccountLink'>;

// $FlowFixMe - Template types are correct.
export const createListener: CreateListener = generateCreateListener(
  AccountLink,
);
// $FlowFixMe - Template types are correct.
export const createCursor: CreateCursor = generateCreateCursor(AccountLink);
// $FlowFixMe - Template types are correct.
export const createOperation: CreateOperation = generateCreateOperation(
  AccountLink,
);

export default generateActionCreators(AccountLink);
