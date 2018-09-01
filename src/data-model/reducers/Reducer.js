/* @flow */

import Immutable from 'immutable';

import type { Model, ModelCollection } from 'common/lib/models/Model';
import type {
  ModelCursorMap,
  ModelCursorStateMap,
  ModelListenerMap,
  ModelListenerStateMap,
  ModelOperationMap,
  ModelOperationStateMap,
} from '../types';
import type { ModelStub } from 'common/types/core';
import type { PureAction } from '../../store';

export type State<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
  TCollection: ModelCollection<TModelName, TRaw, TModel>,
> = {
  +collection: TCollection,
  +cursorMap: ModelCursorMap<TModelName>,
  +cursorStateMap: ModelCursorStateMap<TModelName>,
  +listenerMap: ModelListenerMap<TModelName>,
  +listenerStateMap: ModelListenerStateMap<TModelName>,
  +operationMap: ModelOperationMap<TModelName>,
  +operationStateMap: ModelOperationStateMap<TModelName>,
};

export function generateReducer<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
  TCollection: ModelCollection<TModelName, TRaw, TModel>,
  TReducerState: State<TModelName, TRaw, TModel, TCollection>,
>(ModelCtor: Class<TModel>) {
  // $FlowFixMe - This is correct.
  const DEFAULT_STATE: TReducerState = {
    collection: Immutable.Map(),
    cursorMap: Immutable.Map(),
    cursorStateMap: Immutable.Map(),
    listenerMap: Immutable.Map(),
    listenerStateMap: Immutable.Map(),
  };
  const { modelName } = ModelCtor;

  return (
    state: TReducerState = DEFAULT_STATE,
    action: PureAction,
  ): TReducerState => {
    switch (action.type) {
      case 'MODEL_UPDATE_STATE': {
        if (action.modelName !== modelName) {
          return state;
        }
        // $FlowFixMe - Assuming model names are mutually exclusive.
        return {
          ...state,
          collection: action.collection,
          cursorMap: action.cursorMap,
          cursorStateMap: action.cursorStateMap,
          listenerMap: action.listenerMap,
          listenerStateMap: action.listenerStateMap,
          operationMap: action.operationMap,
          operationStateMap: action.operationStateMap,
        };
      }

      default: {
        return state;
      }
    }
  };
}
