/* @flow */

/* eslint-disable flowtype/generic-spacing */

import type FindiError from 'common/lib/FindiError';
import type Immutable from 'immutable';

import type { ID } from 'common/types/core';
import type {
  ModelCollectionQuery,
  ModelOrderedCollectionQuery,
  ModelQuery,
} from 'common/lib/models/Model';

export type LoadState =
  | {| +type: 'UNINITIALIZED' | 'LOADING' | 'STEADY' |}
  | {| +error: FindiError, +type: 'FAILURE' |};

// TODO: Move this to common.
export type ModelCursor<TModelName: string> = {|
  +id: ID,
  +modelName: TModelName,
  +pageSize: number,
  +query: ModelOrderedCollectionQuery,
|};

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

export type ModelCursorStateMap<TModelName: string> = Immutable.Map<
  ID,
  ModelCursorState<TModelName>,
>;

// TODO: Move this to common.
export type ModelListener<TModelName: string> = {|
  +id: ID,
  +modelName: TModelName,
  +query: ModelCollectionQuery,
|};

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

export type ModelListenerStateMap<TModelName: string> = Immutable.Map<
  ID,
  ModelListenerState<TModelName>,
>;

export type ModelOperation<TModelName: string> = {|
  +id: ID,
  +modelName: TModelName,
  +query: ModelQuery,
|};

export type ModelOperationMap<TModelName: string> = Immutable.Map<
  ID,
  ModelOperation<TModelName>,
>;

export type ModelOperationState<TModelName: string> =
  | ModelOperationState$Collection<TModelName>
  | ModelOperationState$OrderedCollection<TModelName>
  | ModelOperationState$Single<TModelName>;

export type ModelOperationState$Collection<TModelName: string> = {|
  +loadState: LoadState,
  +modelIDs: Immutable.Set<ID>,
  +modelName: TModelName,
  +operationID: ID,
  +queryType: 'COLLECTION_QUERY',
|};

export type ModelOperationState$OrderedCollection<TModelName: string> = {|
  +loadState: LoadState,
  +modelIDs: Immutable.List<ID>,
  +modelName: TModelName,
  +operationID: ID,
  +queryType: 'ORDERED_COLLECTION_QUERY',
|};

export type ModelOperationState$Single<TModelName: string> = {|
  +loadState: LoadState,
  +modelID: ID | null,
  +modelName: TModelName,
  +operationID: ID,
  +queryType: 'SINGLE_QUERY',
|};

export type ModelOperationStateMap<TModelName: string> = Immutable.Map<
  ID,
  ModelOperationState<TModelName>,
>;
