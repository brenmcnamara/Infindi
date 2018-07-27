/* @flow */

import Immutable from 'immutable';

import invariant from 'invariant';

import type { ID } from 'common/types/core';
import type { ModelStub } from 'common/lib/db-utils';
import type {
  Model,
  ModelCollection,
  ModelOrderedCollection,
} from 'common/lib/models/Model';
import type {
  ModelCursor,
  ModelCursorState,
  ModelListener,
  ModelListenerState,
  ModelOperation,
  ModelOperationState,
} from '../types';
import type { ReduxState } from '../../store';
import type { State as ReducerState } from '../reducers/Reducer';

export type StateUtils<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
  TCollection: ModelCollection<TModelName, TRaw, TModel>,
  TOrderedCollection: ModelOrderedCollection<TModelName, TRaw, TModel>,
> = {
  +findModel: (
    reduxState: ReduxState,
    predicate: (model: TModel) => boolean,
  ) => TModel | null,

  +getCollection: (reduxState: ReduxState) => TCollection,

  +getCursor: (
    reduxState: ReduxState,
    cursorID: ID,
  ) => ModelCursor<TModelName> | null,

  +getCursorState: (
    reduxState: ReduxState,
    cursorID: ID,
  ) => ModelCursorState<TModelName> | null,

  +getListener: (
    reduxState: ReduxState,
    listenerID: ID,
  ) => ModelListener<TModelName> | null,

  +getListenerState: (
    reduxState: ReduxState,
    listenerID: ID,
  ) => ModelListenerState<TModelName> | null,

  +getModel: (reduxState: ReduxState, id: ID) => TModel | null,

  +getModelNullthrows: (reduxState: ReduxState, id: ID) => TModel,

  +getOperation: (
    reduxState: ReduxState,
    operationID: ID,
  ) => ModelOperation<TModelName> | null,

  +getOperationState: (
    reduxState: ReduxState,
    operationID: ID,
  ) => ModelOperationState<TModelName> | null,

  getOrderedCollectionForCursor: (
    reduxState: ReduxState,
    cursorID: ID,
  ) => TOrderedCollection,
};

export function generateStateUtils<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
  TCollection: ModelCollection<TModelName, TRaw, TModel>,
  TOrderedCollection: ModelOrderedCollection<TModelName, TRaw, TModel>,
  TReducerState: ReducerState<TModelName, TRaw, TModel, TCollection>,
>(
  ModelCtor: Class<TModel>,
  getReducerState: (reduxState: ReduxState) => TReducerState,
): StateUtils<TModelName, TRaw, TModel, TCollection, TOrderedCollection> {
  return {
    findModel: (
      reduxState: ReduxState,
      predicate: (model: TModel) => boolean,
    ) => getReducerState(reduxState).collection.find(predicate) || null,

    getCollection: (reduxState: ReduxState) =>
      getReducerState(reduxState).collection,

    getCursor: (reduxState: ReduxState, cursorID) =>
      getReducerState(reduxState).cursorMap.get(cursorID) || null,

    getCursorState: (reduxState: ReduxState, cursorID: ID) =>
      getReducerState(reduxState).cursorStateMap.get(cursorID) || null,

    getModel: (reduxState: ReduxState, id: ID) =>
      getReducerState(reduxState).collection.get(id) || null,

    getModelNullthrows: (reduxState: ReduxState, id: ID) => {
      const model = getReducerState(reduxState).collection.get(id);
      invariant(
        model,
        'Expecting %s model with id %s to exist',
        ModelCtor.modelName,
        id,
      );
      return model;
    },

    getListener: (reduxState: ReduxState, listenerID: ID) =>
      getReducerState(reduxState).listenerMap.get(listenerID) || null,

    getListenerState: (reduxState: ReduxState, listenerID: ID) =>
      getReducerState(reduxState).listenerStateMap.get(listenerID) || null,

    getOperation: (reduxState: ReduxState, operationID: ID) =>
      getReducerState(reduxState).operationMap.get(operationID) || null,

    getOperationState: (reduxState: ReduxState, operationID: ID) =>
      getReducerState(reduxState).operationStateMap.get(operationID) || null,

    getOrderedCollectionForCursor: (reduxState: ReduxState, cursorID: ID) => {
      const cursorState = getReducerState(reduxState).cursorStateMap.get(
        cursorID,
      );
      invariant(
        cursorState,
        'Expecting model %s to have cursor with id: %s',
        ModelCtor.modelName,
        cursorID,
      );
      const { collection } = getReducerState(reduxState);
      // $FlowFixMe - This is correct.
      return Immutable.OrderedMap(
        cursorState.modelIDs.map(modelID => {
          const model = collection.get(modelID);
          invariant(
            model,
            'Expecting %s model to exist for id: %s',
            ModelCtor.modelName,
            modelID,
          );
          return [modelID, model];
        }),
      );
    },
  };
}
