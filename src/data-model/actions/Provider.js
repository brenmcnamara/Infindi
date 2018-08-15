/* @flow */

import Provider from 'common/lib/models/Provider';

import {
  generateActionCreators,
  generateCreateCursor,
  generateCreateListener,
  generateCreateOperation,
} from './Actions';

import type { Action as ActionTemplate } from './Actions';
import type {
  ProviderCollection,
  ProviderRaw,
} from 'common/lib/models/Provider';
import type { ModelCursor, ModelListener, ModelOperation } from '../types';
import type {
  ModelCollectionQuery,
  ModelOrderedCollectionQuery,
} from 'common/lib/models/Model';

// eslint-disable-next-line flowtype/generic-spacing
export type Action = ActionTemplate<
  'Provider',
  ProviderRaw,
  Provider,
  ProviderCollection,
>;

type CreateCursor = (
  query: ModelOrderedCollectionQuery,
  pageSize: number,
) => ModelCursor<'Provider'>;

type CreateListener = (
  query: ModelCollectionQuery,
) => ModelListener<'Provider'>;

type CreateOperation = (
  query: ModelCollectionQuery,
) => ModelOperation<'Provider'>;

// $FlowFixMe - Template types are correct.
export const createCursor: CreateCursor = generateCreateCursor(Provider);
// $FlowFixMe - Template types are correct.
export const createListener: CreateListener = generateCreateListener(Provider);
// $FlowFixMe - Template types are correct.
export const createOperation: CreateOperation = generateCreateOperation(
  Provider,
);

export default generateActionCreators(Provider);
