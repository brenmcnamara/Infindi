/* @flow */

import invariant from 'invariant';

import type { ID, ModelStub } from 'common/src/types/core';
import type { PureAction, Reducer } from './typesDEPRECATED/redux';

// TODO: Port this from Infindi-Backend
type InfindiError = { errorCode: string, errorMessage: string };

export type ModelLoader<TName: string, TModel: ModelStub<TName>> =
  | {|
      +preUpdateModel: TModel,
      +type: 'UPDATING',
    |}
  | {|
      +model: TModel,
      +type: 'STEADY',
    |}
  | {|
      +preFailureModel: TModel,
      +model: TModel,
      +type: 'UPDATE_FAILURE',
    |};

export type ModelCollection<TName: string, TModel: ModelStub<TName>> = {
  [id: ID]: TModel,
};

export type ModelLoaderCollection<TName: string, TModel: ModelStub<TName>> = {
  [id: ID]: ModelLoader<TName, TModel>,
};

export type ModelLoaderState<TName: string, TModel: ModelStub<TName>> =
  | {|
      +type: 'EMPTY',
    |}
  | {|
      +type: 'DOWNLOADING',
    |}
  | {|
      +error: InfindiError,
      +type: 'DOWNLOAD_FAILED',
    |}
  | {|
      +loaderCollection: ModelLoaderCollection<TName, TModel>,
      +type: 'STEADY',
    |};

export type Action<
  TName: string,
  TModel: ModelStub<TName>,
> = Action$ModelLoaderCollection<TName, TModel>;

export type Action$ModelLoaderCollection<
  TName: string,
  TModel: ModelStub<TName>,
> =
  | {|
      +modelName: TName,
      +type: 'COLLECTION_DOWNLOAD_START',
    |}
  | {|
      +collection: ModelCollection<TName, TModel>,
      +modelName: TName,
      +type: 'COLLECTION_DOWNLOAD_FINISHED',
    |}
  | {|
      +error: InfindiError,
      +modelName: TName,
      +type: 'COLLECTION_DOWNLOAD_FAILURE',
    |}
  | {| +modelName: TName, +type: 'COLLECTION_CLEAR' |};

const DEFAULT_STATE = {
  type: 'EMPTY',
};

/**
 * Generates a reducer for a model with a particular name.
 */
export function createModelCollectionReducer<
  TName: string,
  TModel: ModelStub<TName>,
>(modelName: TName): Reducer<ModelLoaderState<TName, TModel>> {
  return (
    state: ModelLoaderState<TName, TModel> = DEFAULT_STATE,
    action: PureAction,
  ) => {
    switch (action.type) {
      case 'COLLECTION_DOWNLOAD_START': {
        if (action.modelName === modelName) {
          return { type: 'DOWNLOADING' };
        }
        break;
      }

      case 'COLLECTION_DOWNLOAD_FINISHED': {
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
          // $FlowFixMe - See above explanation
          const collection: ModelCollection<TName, TModel> = action.collection;
          return mergeCollectionWithState(modelName, state, collection);
        }
        break;
      }

      case 'COLLECTION_DOWNLOAD_FAILURE': {
        if (action.modelName === modelName) {
          return mergeDownloadFailureWithState(modelName, state, action.error);
        }
        break;
      }

      case 'COLLECTION_CLEAR': {
        if (action.modelName === modelName) {
          return { type: 'EMPTY' };
        }
        break;
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

function mergeCollectionWithState<TName: string, TModel: ModelStub<TName>>(
  modelName: TName,
  state: ModelLoaderState<TName, TModel>,
  collection: ModelCollection<TName, TModel>,
): ModelLoaderState<TName, TModel> {
  invariant(
    state.type === 'DOWNLOADING',
    '%s collection state cannot merge a collection from state: %s',
    modelName,
    state.type,
  );
  return {
    loaderCollection: collectionToLoaderMap(collection),
    type: 'STEADY',
  };
}

function mergeDownloadFailureWithState<TName: string, TModel: ModelStub<TName>>(
  modelName: TName,
  state: ModelLoaderState<TName, TModel>,
  error: InfindiError,
): ModelLoaderState<TName, TModel> {
  invariant(
    state.type === 'DOWNLOADING',
    '%s collection state cannot merge with a download error %s with state %s',
    modelName,
    error.errorCode,
    state.type,
  );
  return { error, type: 'DOWNLOAD_FAILED' };
}

function collectionToLoaderMap<TName: string, TModel: ModelStub<TName>>(
  collection: ModelCollection<TName, TModel>,
): ModelLoaderCollection<TName, TModel> {
  const loader = {};
  for (let id: ID in collection) {
    if (collection.hasOwnProperty(id)) {
      const model: TModel = collection[id];
      const modelLoader: ModelLoader<TName, TModel> = { model, type: 'STEADY' };
      loader[id] = modelLoader;
    }
  }
  return loader;
}