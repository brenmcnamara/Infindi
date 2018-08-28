/* @flow */

import type { ID, ModelStub } from 'common/types/core';
import type { Model, ModelCollection } from 'common/lib/models/Model';
import type {
  ModelCursor,
  ModelCursorMap,
  ModelCursorStateMap,
  ModelListener,
  ModelListenerMap,
  ModelListenerStateMap,
  ModelOperation,
  ModelOperationMap,
  ModelOperationStateMap,
} from '../types';

// TODO: What about pagination?
export type ActionCreators<TModelName: string> = {|
  +clearReduxState: () => Action$ModelClearReduxState<TModelName>,

  +deleteCursor: (cursorID: ID) => Action$ModelDeleteCursor<TModelName>,

  +deleteListener: (listenerID: ID) => Action$ModelDeleteListener<TModelName>,

  +deleteModelLocally: (modelID: ID) => Action$DeleteModelLocally<TModelName>,

  +deleteOperation: (
    operationID: ID,
  ) => Action$ModelDeleteOperation<TModelName>,

  +fetchCursorPage: (cursorID: ID) => Action$ModelFetchCursorPage<TModelName>,

  +setAndRunListener: (
    listener: ModelListener<TModelName>,
  ) => Action$ModelSetAndRunListener<TModelName>,

  +setAndRunOperation: (
    operation: ModelOperation<TModelName>,
  ) => Action$ModelSetAndRunOperation<TModelName>,

  +setCursor: (
    cursor: ModelCursor<TModelName>,
  ) => Action$ModelSetCursor<TModelName>,
|};

export type Action<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
  TCollection: ModelCollection<TModelName, TRaw, TModel>,
> =
  | Action$ModelClearReduxState<TModelName>
  | Action$ModelDeleteCursor<TModelName>
  | Action$ModelDeleteListener<TModelName>
  | Action$ModelDeleteModelLocally<TModelName>
  | Action$ModelDeleteOperation<TModelName>
  | Action$ModelFetchCursorPage<TModelName>
  | Action$ModelSetAndRunListener<TModelName>
  | Action$ModelSetAndRunOperation<TModelName>
  | Action$ModelSetCursor<TModelName>
  | Action$ModelUpdateState<TModelName, TRaw, TModel, TCollection>;

export type Action$ModelClearReduxState<TModelName: string> = {|
  +modelName: TModelName,
  +type: 'MODEL_CLEAR_REDUX_STATE',
|};

export type Action$ModelDeleteCursor<TModelName: string> = {|
  +cursorID: ID,
  +modelName: TModelName,
  +type: 'MODEL_DELETE_CURSOR',
|};

export type Action$ModelDeleteListener<TModelName: string> = {|
  +listenerID: ID,
  +modelName: TModelName,
  +type: 'MODEL_DELETE_LISTENER',
|};

export type Action$ModelDeleteModelLocally<TModelName: string> = {|
  +modelID: ID,
  +modelName: TModelName,
  +type: 'MODEL_DELETE_MODEL_LOCALLY',
|};

export type Action$ModelDeleteOperation<TModelName: string> = {|
  +modelName: TModelName,
  +operationID: ID,
  +type: 'MODEL_DELETE_OPERATION',
|};

export type Action$ModelFetchCursorPage<TModelName: string> = {|
  +cursorID: ID,
  +modelName: TModelName,
  +type: 'MODEL_FETCH_CURSOR_PAGE',
|};

export type Action$ModelSetAndRunListener<TModelName: string> = {|
  +listener: ModelListener<TModelName>,
  +modelName: TModelName,
  +type: 'MODEL_SET_AND_RUN_LISTENER',
|};

export type Action$ModelSetAndRunOperation<TModelName: string> = {|
  +modelName: TModelName,
  +operation: ModelOperation<TModelName>,
  +type: 'MODEL_SET_AND_RUN_OPERATION',
|};

export type Action$ModelSetCursor<TModelName: string> = {|
  +cursor: ModelCursor<TModelName>,
  +modelName: TModelName,
  +type: 'MODEL_SET_CURSOR',
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
  +operationMap: ModelOperationMap<TModelName>,
  +operationStateMap: ModelOperationStateMap<TModelName>,
  +type: 'MODEL_UPDATE_STATE',
|};

export function generateActionCreators<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
>(ModelCtor: Class<TModel>): ActionCreators<TModelName> {
  const modelName = ModelCtor.modelName;
  return {
    clearReduxState: () => ({
      modelName,
      type: 'MODEL_CLEAR_REDUX_STATE',
    }),

    deleteCursor: (cursorID: ID) => ({
      cursorID,
      modelName,
      type: 'MODEL_DELETE_CURSOR',
    }),

    deleteListener: (listenerID: ID) => ({
      listenerID,
      modelName,
      type: 'MODEL_DELETE_LISTENER',
    }),

    deleteModelLocally: (modelID: ID) => ({
      modelID,
      modelName,
      type: 'MODEL_DELETE_MODEL_LOCALLY',
    }),

    deleteOperation: (operationID: ID) => ({
      modelName,
      operationID,
      type: 'MODEL_DELETE_OPERATION',
    }),

    fetchCursorPage: (cursorID: ID) => ({
      cursorID,
      modelName,
      type: 'MODEL_FETCH_CURSOR_PAGE',
    }),

    setAndRunListener: (listener: ModelListener<TModelName>) => ({
      listener,
      modelName,
      type: 'MODEL_SET_AND_RUN_LISTENER',
    }),

    setAndRunOperation: (operation: ModelOperation<TModelName>) => ({
      modelName,
      operation,
      type: 'MODEL_SET_AND_RUN_OPERATION',
    }),

    setCursor: (cursor: ModelCursor<TModelName>) => ({
      cursor,
      modelName,
      type: 'MODEL_SET_CURSOR',
    }),
  };
}
