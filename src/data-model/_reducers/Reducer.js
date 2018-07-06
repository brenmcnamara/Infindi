/* @flow */

import Immutable from 'immutable';

import type FindiError from 'common/lib/FindiError';

import type { ID, ModelStub } from 'common/types/core';
import type { Model, ModelCollection } from 'common/lib/models/Model';
import type { PureAction } from '../../store';

export type ModelLoadState =
  | {| +error: FindiError, +type: 'FAILURE' |}
  | {| +type: 'EMPTY' | 'LOADING' | 'STEADY' |};

export type State<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
> = {
  +collection: Immutable.Map<ID, TModel>,
  +loadState: ModelLoadState,
};

export function generateReducer<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
  TCollection: ModelCollection<TModelName, TRaw, TModel>,
>(ModelCtor: Class<TModel>) {
  const DEFAULT_STATE: State<TModelName, TRaw, TModel> = {
    collection: Immutable.Map(),
    loadState: { type: 'EMPTY' },
  };
  const {modelName} = ModelCtor;

  return (
    state: State<TModelName, TRaw, TModel> = DEFAULT_STATE,
    action: PureAction,
  ): State<TModelName, TRaw, TModel> => {
    switch (action.type) {
      default: {
        return state;
      }
    }
  };
}
