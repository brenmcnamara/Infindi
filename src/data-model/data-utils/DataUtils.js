/* @flow */

import uuid from 'uuid/v4';

import type {
  Model,
  ModelCollectionQuery,
  ModelOrderedCollectionQuery,
  ModelQuery,
} from 'common/lib/models/Model';
import type { ModelCursor, ModelListener, ModelOperation } from '../types';

import type { ModelStub } from 'common/types/core';

export type DataUtils<TModelName: string> = {|
  +createCursor: (
    query: ModelOrderedCollectionQuery,
    pageSize: number,
  ) => ModelCursor<TModelName>,

  +createListener: (query: ModelCollectionQuery) => ModelListener<TModelName>,

  +createOperation: (query: ModelQuery) => ModelOperation<TModelName>,
|};

export function generateDataUtils<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
>(ModelCtor: Class<TModel>): DataUtils<TModelName> {
  const modelName = ModelCtor.modelName;
  return {
    createCursor: (query: ModelOrderedCollectionQuery, pageSize: number) => ({
      id: uuid(),
      modelName,
      pageSize,
      query,
    }),

    createListener: (query: ModelCollectionQuery) => ({
      id: uuid(),
      modelName,
      query,
    }),

    createOperation: (query: ModelQuery) => ({
      id: uuid(),
      modelName,
      query,
    }),
  };
}
