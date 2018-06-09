/* @flow */

import invariant from 'invariant';

import type { ID, ModelStub } from 'common/types/core';
import type { Model } from 'common/lib/models/Model';
import type { PureAction, Reducer } from './store';

// TODO: Port this from Infindi-Backend
type InfindiError = { errorCode: string, errorMessage: string };

// -----------------------------------------------------------------------------
//
// REDUCER GENERATOR
//
// -----------------------------------------------------------------------------

export type ContainerUpdateStrategy =
  | 'REPLACE_CURRENT_CONTAINER'
  | 'MERGE_WITH_CURRENT_CONTAINER';

export type ModelContainer<
  TName: string,
  TRaw: ModelStub<TName>,
  TModel: Model<TName, TRaw>,
> = {
  [id: ID]: TModel,
};

export type ModelState<
  TName: string,
  TRaw: ModelStub<TName>,
  TModel: Model<TName, TRaw>,
> =
  | {|
      +type: 'EMPTY',
    |}
  | {|
      +container: ModelContainer<TName, TRaw, TModel> | null,
      +type: 'DOWNLOADING',
    |}
  | {|
      +error: InfindiError,
      +type: 'DOWNLOAD_FAILED',
    |}
  | {|
      +container: ModelContainer<TName, TRaw, TModel>,
      +type: 'STEADY',
    |};

export type Action<
  TName: string,
  TRaw: ModelStub<TName>,
  TModel: Model<TName, TRaw>,
> = Action$ModelContainer<TName, TRaw, TModel>;

export type Action$ModelContainer<
  TName: string,
  TRaw: ModelStub<TName>,
  TModel: Model<TName, TRaw>,
> =
  | {|
      +downloadInfo?: any,
      +modelName: TName,
      +operationID: ID,
      +type: 'CONTAINER_DOWNLOAD_START',
    |}
  | {|
      +container: ModelContainer<TName, TRaw, TModel>,
      +downloadInfo?: any,
      +modelName: TName,
      +operationID: ID,
      +type: 'CONTAINER_DOWNLOAD_FINISHED',
      +updateStrategy: ContainerUpdateStrategy,
    |}
  | {|
      +error: InfindiError,
      +modelName: TName,
      +operationID: ID,
      +type: 'CONTAINER_DOWNLOAD_FAILURE',
    |}
  | {|
      +modelName: TName,
      +operationID: ID,
      +type: 'CONTAINER_CLEAR',
    |}
  | {|
      +modelID: ID,
      +modelName: TName,
      +operationID: ID,
      +shouldPersist: boolean,
      +type: 'MODEL_REMOVE',
    |};

const DEFAULT_STATE = {
  type: 'EMPTY',
};

/**
 * Generates a reducer for a model with a particular name.
 */
export function createModelContainerReducer<
  TName: string,
  TRaw: ModelStub<TName>,
  TModel: Model<TName, TRaw>,
>(modelName: TName): Reducer<ModelState<TName, TRaw, TModel>> {
  return (
    state: ModelState<TName, TRaw, TModel> = DEFAULT_STATE,
    action: PureAction,
  ) => {
    switch (action.type) {
      case 'CONTAINER_DOWNLOAD_START': {
        if (action.modelName === modelName) {
          return {
            container: getContainer(state),
            type: 'DOWNLOADING',
          };
        }
        break;
      }

      case 'CONTAINER_DOWNLOAD_FINISHED': {
        if (action.modelName === modelName) {
          // NOTE: Flow does not know how to reconcile the model names. This is
          // because flow cannot make the assumption that these names are
          // mutually exclusive, so even though we did an equality check above,
          // it could be the case that TModelName1 === A | B and
          // TModelName2 === B | C and the above check just happened to hit the
          // case where both modelNames were B, even though they are from
          // different types. However, we are operating under the assunmption
          // that model names are always mutually exclusive, so we know better
          // than flow here.
          const container: ModelContainer<TName, TRaw, TModel> =
            // $FlowFixMe - See above explanation
            action.container;
          return mergeContainerWithState(
            modelName,
            state,
            container,
            action.updateStrategy,
          );
        }
        break;
      }

      case 'CONTAINER_DOWNLOAD_FAILURE': {
        if (action.modelName === modelName) {
          return mergeDownloadFailureWithState(modelName, state, action.error);
        }
        break;
      }

      case 'CONTAINER_CLEAR': {
        if (action.modelName === modelName) {
          return { type: 'EMPTY' };
        }
        break;
      }

      case 'MODEL_REMOVE': {
        if (action.modelName === modelName) {
          return removeModel(action.modelID, state);
        }
      }
    }
    return state;
  };
}

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

export function getContainer<
  TName: string,
  TRaw: ModelStub<TName>,
  TModel: Model<TName, TRaw>,
>(
  state: ModelState<TName, TRaw, TModel>,
): ModelContainer<TName, TRaw, TModel> | null {
  switch (state.type) {
    case 'EMPTY':
    case 'DOWNLOAD_FAILED': {
      return null;
    }
    case 'DOWNLOADING': {
      return state.container;
    }
    case 'STEADY': {
      return state.container;
    }
    default:
      return invariant(false, 'Unrecognized container state: %s', state.type);
  }
}

function mergeContainerWithState<
  TName: string,
  TRaw: ModelStub<TName>,
  TModel: Model<TName, TRaw>,
>(
  modelName: TName,
  state: ModelState<TName, TRaw, TModel>,
  container: ModelContainer<TName, TRaw, TModel>,
  updateStrategy: ContainerUpdateStrategy,
): ModelState<TName, TRaw, TModel> {
  switch (updateStrategy) {
    case 'REPLACE_CURRENT_CONTAINER': {
      return { container, type: 'STEADY' };
    }

    case 'MERGE_WITH_CURRENT_CONTAINER': {
      const prevContainer = getContainer(state);
      const nextContainer = { ...prevContainer, ...container };
      return { container: nextContainer, type: 'STEADY' };
    }

    default:
      return invariant(
        false,
        'Unknown container update strategy: %s',
        updateStrategy,
      );
  }
}

function mergeDownloadFailureWithState<
  TName: string,
  TRaw: ModelStub<TName>,
  TModel: Model<TName, TRaw>,
>(
  modelName: TName,
  state: ModelState<TName, TRaw, TModel>,
  error: InfindiError,
): ModelState<TName, TRaw, TModel> {
  invariant(
    state.type === 'DOWNLOADING',
    '[%s Container State]: Cannot merge with a download error %s with state %s',
    modelName,
    error.errorCode,
    state.type,
  );
  return { error, type: 'DOWNLOAD_FAILED' };
}

function removeModel<
  TName: string,
  TRaw: ModelStub<TName>,
  TModel: Model<TName, TRaw>,
>(
  modelID: ID,
  state: ModelState<TName, TRaw, TModel>,
): ModelState<TName, TRaw, TModel> {
  // TODO: May want to throw if trying to delete a model that does not exist.
  if (state.type !== 'STEADY') {
    return state;
  }
  const container = { ...state.container };
  delete container[modelID];
  return { container, type: 'STEADY' };
}
