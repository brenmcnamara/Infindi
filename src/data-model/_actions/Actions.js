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
  +deleteEverything: () => Action$ModelDeleteEverything<TModelName>,

  +deleteListener: (listenerID: ID) => Action$ModelDeleteListener<TModelName>,

  +fetchCursorPage: (cursorID: ID) => Action$ModelFetchCursorPage<TModelName>,

  +setCursor: (
    cursor: ModelCursor<TModelName>,
  ) => Action$ModelSetCursor<TModelName>,

  +setListener: (
    listener: ModelListener<TModelName>,
  ) => Action$ModelSetListener<TModelName>,
|};

export type Action<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
  TCollection: ModelCollection<TModelName, TRaw, TModel>,
> =
  | Action$ModelDeleteEverything<TModelName>
  | Action$ModelDeleteListener<TModelName>
  | Action$ModelFetchCursorPage<TModelName>
  | Action$ModelSetCursor<TModelName>
  | Action$ModelSetListener<TModelName>
  | Action$ModelUpdateState<TModelName, TRaw, TModel, TCollection>;

export type Action$ModelDeleteEverything<TModelName: string> = {|
  +modelName: TModelName,
  +type: 'MODEL_DELETE_EVERYTHING',
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

export type Action$ModelSetCursor<TModelName: string> = {|
  +cursor: ModelCursor<TModelName>,
  +modelName: TModelName,
  +type: 'MODEL_SET_CURSOR',
|};

export type Action$ModelSetListener<TModelName: string> = {|
  +listener: ModelListener<TModelName>,
  +modelName: TModelName,
  +type: 'MODEL_SET_LISTENER',
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

export function generateCreateCursor<
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
    deleteEverything: () => ({
      modelName,
      type: 'MODEL_DELETE_EVERYTHING',
    }),

    deleteListener: (listenerID: ID) => ({
      listenerID,
      modelName,
      type: 'MODEL_DELETE_LISTENER',
    }),

    setCursor: (cursor: ModelCursor<TModelName>) => ({
      cursor,
      modelName,
      type: 'MODEL_SET_CURSOR',
    }),

    setListener: (listener: ModelListener<TModelName>) => ({
      listener,
      modelName,
      type: 'MODEL_SET_LISTENER',
    }),

    fetchCursorPage: (cursorID: ID) => ({
      cursorID,
      modelName,
      type: 'MODEL_FETCH_CURSOR_PAGE',
    }),
  };
}
