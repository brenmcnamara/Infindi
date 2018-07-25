/* @flow */

import type FindiError from 'common/lib/FindiError';
import type Immutable from 'immutable';

import type { ID } from 'common/types/core';
import type { ModelOrderedQuery, ModelQuery } from 'common/lib/models/Model';

export type LoadState =
  | {| +type: 'EMPTY' | 'LOADING' | 'STEADY' |}
  | {| +error: FindiError, +type: 'FAILURE' |};

// TODO: Move this to common.
export type ModelCursor<TModelName: string> = {|
  +id: ID,
  +modelName: TModelName,
  +pageSize: number,
  +query: ModelOrderedQuery,
|};

// eslint-disable-next-line flowtype/generic-spacing
export type ModelCursorMap<TModelName: string> = Immutable.Map<
  ID,
  ModelCursor<TModelName>,
>;

export type ModelCursorState<TModelName: string> = {|
  +cursorID: ID,
  +cursorRef: Object | null,
  +didReachEnd: boolean,
  +loadState: LoadState,
  +modelIDs: Immutable.List<ID>,
  +modelName: TModelName,
|};

// eslint-disable-next-line flowtype/generic-spacing
export type ModelCursorStateMap<TModelName: string> = Immutable.Map<
  ID,
  ModelCursorState<TModelName>,
>;

// TODO: Move this to common.
export type ModelListener<TModelName: string> = {|
  +id: ID,
  +modelName: TModelName,
  +query: ModelQuery,
|};

// eslint-disable-next-line flowtype/generic-spacing
export type ModelListenerMap<TModelName: string> = Immutable.Map<
  ID,
  ModelListener<TModelName>,
>;

export type ModelListenerState<TModelName: string> = {|
  +listenerID: ID,
  +loadState: LoadState,
  +modelIDs: Immutable.Set<ID>,
  +modelName: TModelName,
|};

// eslint-disable-next-line flowtype/generic-spacing
export type ModelListenerStateMap<TModelName: string> = Immutable.Map<
  ID,
  ModelListenerState<TModelName>,
>;

export type ModelOperation<TModelName: string> = {|
  +id: ID,
  +modelName: TModelName,
  +query: ModelQuery,
|};

// eslint-disable-next-line flowtype/generic-spacing
export type ModelOperationMap<TModelName: string> = Immutable.Map<
  ID,
  ModelOperation<TModelName>,
>;

export type ModelOperationState<TModelName: string> = {|
  +loadState: LoadState,
  +modelIDs: Immutable.Set<ID>,
  +modelName: TModelName,
  +operationID: ID,
|};

// eslint-disable-next-line flowtype/generic-spacing
export type ModelOperationStateMap<TModelName: string> = Immutable.Map<
  ID,
  ModelOperationState<TModelName>,
>;
