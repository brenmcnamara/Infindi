/* @flow */

import type { ID } from 'common/types/core';
import type { ModelStub } from 'common/lib/db-utils';
import type { Model, ModelCollection } from 'common/lib/models/Model';
import type {
  ModelCursor,
  ModelCursorState,
  ModelListener,
  ModelListenerState,
} from '../_types';
import type { ReduxState } from '../../store';
import type { State as ReducerState } from '../_reducers/Reducer';

export type StateUtils<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
  TCollection: ModelCollection<TModelName, TRaw, TModel>,
> = {|
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
|};

export function generateStateUtils<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
  TCollection: ModelCollection<TModelName, TRaw, TModel>,
  TReducerState: ReducerState<TModelName, TRaw, TModel, TCollection>,
>(
  ModelCtor: Class<TModel>,
  getReducerState: (reduxState: ReduxState) => TReducerState,
): StateUtils<TModelName, TRaw, TModel, TCollection> {
  return {
    getCollection: (reduxState: ReduxState) =>
      getReducerState(reduxState).collection,

    getCursor: (reduxState: ReduxState, cursorID) =>
      getReducerState(reduxState).cursorMap.get(cursorID) || null,

    getCursorState: (reduxState: ReduxState, cursorID: ID) =>
      getReducerState(reduxState).cursorStateMap.get(cursorID) || null,

    getListener: (reduxState: ReduxState, listenerID: ID) =>
      getReducerState(reduxState).listenerMap.get(listenerID) || null,

    getListenerState: (reduxState: ReduxState, listenerID: ID) =>
      getReducerState(reduxState).listenerStateMap.get(listenerID) || null,
  };
}
