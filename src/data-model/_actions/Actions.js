/* @flow */

import uuid from 'uuid/v1';

import type { ID, ModelStub } from 'common/types/core';
import type { Model, ModelCollection } from 'common/lib/models/Model';
import type {
  ModelCursor,
  ModelCursorMap,
  ModelCursorStateMap,
  ModelListener,
  ModelListenerMap,
  ModelListenerStateMap,
  ModelQuery,
} from '../_types';

// TODO: What about pagination?
export type ActionCreators<TModelName: string> = {|
  +createCursor: (
    cursor: ModelCursor<TModelName>,
  ) => Action$ModelCreateCursor<TModelName>,

  +createListener: (
    listener: ModelListener<TModelName>,
  ) => Action$ModelCreateListener<TModelName>,

  +deleteListener: (listenerID: ID) => Action$ModelDeleteListener<TModelName>,

  +fetchCursorPage: (cursorID: ID) => Action$ModelFetchCursorPage<TModelName>,
|};

export type Action<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
  TCollection: ModelCollection<TModelName, TRaw, TModel>,
> =
  | Action$ModelCreateCursor<TModelName>
  | Action$ModelCreateListener<TModelName>
  | Action$ModelDeleteListener<TModelName>
  | Action$ModelFetchCursorPage<TModelName>
  | Action$ModelUpdateState<TModelName, TRaw, TModel, TCollection>;

export type Action$ModelCreateCursor<TModelName: string> = {|
  +cursor: ModelCursor<TModelName>,
  +modelName: TModelName,
  +type: 'MODEL_CREATE_CURSOR',
|};

export type Action$ModelCreateListener<TModelName: string> = {|
  +listener: ModelListener<TModelName>,
  +modelName: TModelName,
  +type: 'MODEL_CREATE_LISTENER',
|};

export type Action$ModelDeleteListener<TModelName: string> = {|
  +listenerID: ID,
  +modelName: TModelName,
  +type: 'MODEL_DELETE_LISTENER',
|};

export type Action$ModelFetchCursorPage<TModelName: string> = {|
  +cursorID: ID,
  +modelName: TModelName,
  +type: 'MODEL_FETCH_CURSOR_PAGE',
|};

export type Action$ModelUpdateState<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
  TCollection: ModelCollection<TModelName, TRaw, TModel>,
> = {|
  +collection: TCollection,
  +cursorMap: ModelCursorMap<TModelName>,
  +cursorStateMap: ModelCursorStateMap<TModelName>,
  +listenerMap: ModelListenerMap<TModelName>,
  +listenerStateMap: ModelListenerStateMap<TModelName>,
  +modelName: TModelName,
  +type: 'MODEL_UPDATE_STATE',
|};

export function generateCreatePageCursor<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
>(ModelCtor: Class<TModel>) {
  return (query: ModelQuery): ModelCursor<TModelName> => {
    return {
      id: uuid(),
      modelName: ModelCtor.modelName,
      query,
    };
  };
}

export function generateCreateListener<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
>(ModelCtor: Class<TModel>) {
  return (query: ModelQuery): ModelListener<TModelName> => {
    return {
      id: uuid(),
      modelName: ModelCtor.modelName,
      query,
    };
  };
}

export function generateActionCreators<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
>(ModelCtor: Class<TModel>): ActionCreators<TModelName> {
  const modelName = ModelCtor.modelName;
  return {
    createCursor: (cursor: ModelCursor<TModelName>) => ({
      cursor,
      modelName,
      type: 'MODEL_CREATE_CURSOR',
    }),

    createListener: (listener: ModelListener<TModelName>) => ({
      listener,
      modelName,
      type: 'MODEL_CREATE_LISTENER',
    }),

    deleteListener: (listenerID: ID) => ({
      listenerID,
      modelName,
      type: 'MODEL_DELETE_LISTENER',
    }),

    fetchCursorPage: (cursorID: ID) => ({
      cursorID,
      modelName,
      type: 'MODEL_FETCH_CURSOR_PAGE',
    }),
  };
}
