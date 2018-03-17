/* @flow */

import invariant from 'invariant';

import type { ID, ModelStub } from 'common/types/core';
import type { PureAction, Reducer } from './typesDEPRECATED/redux';

// TODO: Port this from Infindi-Backend
type InfindiError = { errorCode: string, errorMessage: string };

// -----------------------------------------------------------------------------
//
// REDUCER GENERATOR
//
// -----------------------------------------------------------------------------

export type ModelContainer<TName: string, TModel: ModelStub<TName>> = {
  [id: ID]: TModel,
};

export type ModelState<TName: string, TModel: ModelStub<TName>> =
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
      +container: ModelContainer<TName, TModel>,
      +type: 'STEADY',
    |};

export type Action<
  TName: string,
  TModel: ModelStub<TName>,
> = Action$ModelContainer<TName, TModel>;

export type Action$ModelContainer<TName: string, TModel: ModelStub<TName>> =
  | {|
      +modelName: TName,
      +type: 'CONTAINER_DOWNLOAD_START',
    |}
  | {|
      +container: ModelContainer<TName, TModel>,
      +modelName: TName,
      +type: 'CONTAINER_DOWNLOAD_FINISHED',
    |}
  | {|
      +error: InfindiError,
      +modelName: TName,
      +type: 'CONTAINER_DOWNLOAD_FAILURE',
    |}
  | {|
      +modelName: TName,
      +type: 'CONTAINER_CLEAR',
    |}
  | {|
      +modelID: ID,
      +modelName: TName,
      +shouldPersist: bool,
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
  TModel: ModelStub<TName>,
>(modelName: TName): Reducer<ModelState<TName, TModel>> {
  return (
    state: ModelState<TName, TModel> = DEFAULT_STATE,
    action: PureAction,
  ) => {
    switch (action.type) {
      case 'CONTAINER_DOWNLOAD_START': {
        if (action.modelName === modelName) {
          return { type: 'DOWNLOADING' };
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
          // $FlowFixMe - See above explanation
          const container: ModelContainer<TName, TModel> = action.container;
          return mergeContainerWithState(modelName, state, container);
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
// MIDDLEWARE GENERATOR
//
// -----------------------------------------------------------------------------

/*
export const createDatastorenMiddleware = <
  TContainerName: string,
  TModelName: string,
  TModel: ModelStub<TModelName>,
>(
  containerName: TContainerName,
  modelName: TModelName,
) => (store: Store) => (next: Next) => {
  const Database = Firebase.firestore();

  function startListening() {
    const loginPayload = getLoginPayload(store.getState());
    Database.container(containerName).where('userRef.refID', '==', loginPayload.userInfo.id);
  }

  function stopListening() {}

  return (action: PureAction) => {};
};
*/

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

function mergeContainerWithState<TName: string, TModel: ModelStub<TName>>(
  modelName: TName,
  state: ModelState<TName, TModel>,
  container: ModelContainer<TName, TModel>,
): ModelState<TName, TModel> {
  // TODO: For now, this erases the previous state and replaces it with the
  // current state. There is going to need to be more complicated logic here.
  // (1) For things like transactions, we want people to fetch more and
  // continue growing the list.
  // (2) For things like accounts, we want to always replace the current state
  // with the new, existing state.
  return {
    container,
    type: 'STEADY',
  };
}

function mergeDownloadFailureWithState<TName: string, TModel: ModelStub<TName>>(
  modelName: TName,
  state: ModelState<TName, TModel>,
  error: InfindiError,
): ModelState<TName, TModel> {
  invariant(
    state.type === 'DOWNLOADING',
    '[%s Container State]: Cannot merge with a download error %s with state %s',
    modelName,
    error.errorCode,
    state.type,
  );
  return { error, type: 'DOWNLOAD_FAILED' };
}

function removeModel<TName: string, TModel: ModelStub<TName>>(
  modelID: ID,
  state: ModelState<TName, TModel>,
): ModelState<TName, TModel> {
  // TODO: May want to throw if trying to delete a model that does not exist.
  if (state.type !== 'STEADY') {
    return state;
  }
  const container = { ...state.container };
  delete container[modelID];
  return { container, type: 'STEADY' };
}
