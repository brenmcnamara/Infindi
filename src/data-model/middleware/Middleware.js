/* @flow */

import FindiError from 'common/lib/FindiError';
import Immutable from 'immutable';

import invariant from 'invariant';

import type { EmitterSubscription } from '../../common/event-utils';
import type { ID, ModelStub } from 'common/types/core';
import type { Model, ModelCollection } from 'common/lib/models/Model';
import type {
  ModelCursor,
  ModelCursorMap,
  ModelCursorState,
  ModelCursorStateMap,
  ModelListener,
  ModelListenerMap,
  ModelListenerState,
  ModelListenerStateMap,
  ModelOperation,
  ModelOperationMap,
  ModelOperationState,
  ModelOperationStateMap,
} from '../types';
import type { Next, PureAction, StoreType } from '../../store';

type ListenerSubscriptionMap = Immutable.Map<ID, EmitterSubscription>;

export default class Middleware<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
  TCollection: ModelCollection<TModelName, TRaw, TModel>,
> {
  // ---------------------------------------------------------------------------
  //
  // MUST OVERRIDE
  //
  // ---------------------------------------------------------------------------
  static __ModelCtor: Class<TModel>;

  // ---------------------------------------------------------------------------
  //
  // DO NOT OVERRIDE
  //
  // ---------------------------------------------------------------------------

  // $FlowFixMe - Why is flow complaining here?
  _collection: TCollection = Immutable.Map();
  _cursorMap: ModelCursorMap<TModelName> = Immutable.Map();
  _cursorStateMap: ModelCursorStateMap<TModelName> = Immutable.Map();
  _listenerMap: ModelListenerMap<TModelName> = Immutable.Map();
  _listenerSubscriptionMap: ListenerSubscriptionMap = Immutable.Map();
  _listenerStateMap: ModelListenerStateMap<TModelName> = Immutable.Map();
  _next: Next;
  _operationMap: ModelOperationMap<TModelName> = Immutable.Map();
  _operationStateMap: ModelOperationStateMap<TModelName> = Immutable.Map();

  _dispatchUpdate = (): void => {
    invariant(
      this._next,
      'Cannot dispatch until data-model middleware has been linked to redux: %s',
      this.constructor.__ModelCtor.modelName,
    );
    // $FlowFixMe - This is correct.
    this._next({
      collection: this._collection,
      cursorMap: this._cursorMap,
      cursorStateMap: this._cursorStateMap,
      listenerMap: this._listenerMap,
      listenerStateMap: this._listenerStateMap,
      modelName: this.constructor.__ModelCtor.modelName,
      operationMap: this._operationMap,
      operationStateMap: this._operationStateMap,
      type: 'MODEL_UPDATE_STATE',
    });
  };

  _setCursor = (cursor: ModelCursor<TModelName>): void => {
    invariant(
      !this._cursorMap.get(cursor.id),
      'Trying to create a cursor for %s that already exists: %s',
      this.constructor.__ModelCtor.modelName,
      cursor.id,
    );

    const cursorState: ModelCursorState<TModelName> = {
      cursorID: cursor.id,
      cursorRef: null,
      didReachEnd: false,
      loadState: { type: 'EMPTY' },
      modelIDs: Immutable.List(),
      modelName: this.constructor.__ModelCtor.modelName,
    };

    this._cursorMap = this._cursorMap.set(cursor.id, cursor);
    this._cursorStateMap = this._cursorStateMap.set(cursor.id, cursorState);
  };

  _setAndRunListener = (listener: ModelListener<TModelName>): void => {
    invariant(
      !this._listenerMap.get(listener.id),
      'Trying to create a listener for %s that already exists: %s',
      this.constructor.__ModelCtor.modelName,
      listener.id,
    );

    const listenerState: ModelListenerState<TModelName> = {
      listenerID: listener.id,
      loadState: { type: 'LOADING' },
      modelIDs: Immutable.Set(),
      modelName: this.constructor.__ModelCtor.modelName,
    };

    const subscription = listener.query.onSnapshot(snapshot =>
      this._onListenerSnapshot(listener.id, snapshot),
    );

    this._listenerMap = this._listenerMap.set(listener.id, listener);
    this._listenerStateMap = this._listenerStateMap.set(
      listener.id,
      listenerState,
    );
    this._listenerSubscriptionMap = this._listenerSubscriptionMap.set(
      listener.id,
      subscription,
    );
  };

  _setAndRunOperation = (operation: ModelOperation<TModelName>): void => {
    invariant(
      !this._operationMap.get(operation.id),
      'Trying to create an operation for %s that already exists: %s',
      this.constructor.__ModelCtor.modelName,
      operation.id,
    );

    const operationState: ModelOperationState<TModelName> = {
      operationID: operation.id,
      loadState: { type: 'LOADING' },
      modelIDs: Immutable.Set(),
      modelName: this.constructor.__ModelCtor.modelName,
    };

    operation.query
      .get()
      .then(snapshot => {
        // NOTE: The user could have deleted the operation before it completed.
        // Need to check that the operation still exists.
        const operationInnerScope = this._operationMap.get(operation.id);
        if (!operationInnerScope) {
          return;
        }
        let operationStateInnerScope = this._operationStateMap.get(
          operation.id,
        );
        invariant(
          operationStateInnerScope,
          'Expecting operation state to exist for %s and given operation: %s',
          this.constructor.__ModelCtor.modelName,
          operation.id,
        );

        const modelIDs: Array<ID> = snapshot.docs.map(doc => doc.data().id);
        const idAndModelPairs: Array<[ID, TModel]> = snapshot.docs.map(doc => {
          const model = this.constructor.__ModelCtor.fromRaw(doc.data());
          return [model.id, model];
        });

        operationStateInnerScope = {
          ...operationStateInnerScope,
          loadState: { type: 'STEADY' },
          modelIDs: Immutable.Set(modelIDs),
        };

        this._operationStateMap = this._operationStateMap.set(
          operation.id,
          operationStateInnerScope,
        );
        this._collection = this._collection.merge(
          Immutable.Map(idAndModelPairs),
        );
        this._dispatchUpdate();
      })
      .catch(error => {
        // NOTE: The user could have deleted the operation before it completed.
        // Need to check that the operation still exists.
        const operationInnerScope = this._operationMap.get(operation.id);
        if (!operationInnerScope) {
          return;
        }
        let operationStateInnerScope = this._operationStateMap.get(
          operation.id,
        );
        invariant(
          operationStateInnerScope,
          'Expecting operation state to exist for %s and given operation: %s',
          this.constructor.__ModelCtor.modelName,
          operation.id,
        );

        const findiError = FindiError.fromUnknownEntity(error);
        operationStateInnerScope = {
          ...operationStateInnerScope,
          loadState: { error: findiError, type: 'FAILURE' },
        };

        this._operationStateMap = this._operationStateMap.set(
          operation.id,
          operationStateInnerScope,
        );
        this._dispatchUpdate();
      });

    this._operationMap = this._operationMap.set(operation.id, operation);
    this._operationStateMap = this._operationStateMap.set(
      operation.id,
      operationState,
    );
  };

  _deleteEverything = (): void => {
    // Delete all listeners.
    this._listenerMap.forEach((_, listenerID) => {
      this._deleteListener(listenerID);
    });

    // Delete all cursors.
    this._cursorMap.forEach((_, cursorID) => {
      this._deleteCursor(cursorID);
    });

    // Delete all state.
    this._collection = Immutable.Map();
  };

  _deleteCursor = (cursorID: ID): void => {
    invariant(
      this._cursorMap.get(cursorID),
      'Trying to delete a cursor for %s that does not exist: %s',
      this.constructor.__ModelCtor.modelName,
      cursorID,
    );

    this._cursorMap = this._cursorMap.delete(cursorID);
    this._cursorStateMap = this._cursorStateMap.delete(cursorID);
  };

  _deleteListener = (listenerID: ID): void => {
    invariant(
      this._listenerMap.get(listenerID),
      'Trying to delete a listener for %s that does not exist: %s',
      this.constructor.__ModelCtor.modelName,
      listenerID,
    );

    const subscription = this._listenerSubscriptionMap.get(listenerID);
    invariant(
      subscription,
      'Expecting listener subscription to exist for listener id: %s',
      listenerID,
    );
    subscription.remove();

    this._listenerMap = this._listenerMap.delete(listenerID);
    this._listenerStateMap = this._listenerStateMap.delete(listenerID);
    this._listenerSubscriptionMap = this._listenerSubscriptionMap.delete(
      listenerID,
    );
  };

  _deleteOperation = (operationID: ID): void => {
    invariant(
      this._operationMap.get(operationID),
      'Trying to delete an operation for %s that does not exist: %s',
      this.constructor.__ModelCtor.modelName,
      operationID,
    );

    this._operationMap = this._operationMap.delete(operationID);
    this._operationStateMap = this._operationStateMap.delete(operationID);
  };

  _onListenerSnapshot = (listenerID: ID, snapshot: Object): void => {
    let listenerState = this._listenerStateMap.get(listenerID);
    invariant(
      listenerState,
      'Expecting listener state for %s to exist for id: %s',
      this.constructor.__ModelCtor.modelName,
      listenerID,
    );

    const modelIDs: Array<ID> = snapshot.docs.map(doc => doc.data().id);
    const idAndModelPairs: Array<[ID, TModel]> = snapshot.docs.map(doc => {
      const model = this.constructor.__ModelCtor.fromRaw(doc.data());
      return [model.id, model];
    });

    listenerState = {
      ...listenerState,
      loadState: { type: 'STEADY' },
      modelIDs: listenerState.modelIDs.merge(Immutable.Set(modelIDs)),
    };

    this._listenerStateMap = this._listenerStateMap.set(
      listenerID,
      listenerState,
    );
    this._collection = this._collection.merge(Immutable.Map(idAndModelPairs));

    this._dispatchUpdate();
  };

  _fetchCursorPageAndDispatchUpdate = (cursorID: ID): void => {
    let cursor = this._cursorMap.get(cursorID);
    let cursorState = this._cursorStateMap.get(cursorID);

    invariant(
      cursor,
      'Expecting cursor to exist for model %s with id: %s',
      this.constructor.__ModelCtor.modelName,
      cursorID,
    );
    invariant(
      cursorState,
      'Expecting cursor state to exist for model %s with id: %s',
      this.constructor.__ModelCtor.modelName,
      cursorID,
    );

    // NOTE: Not handling the case that we get new content after we marked this
    // cursor as reaching the end.
    invariant(
      !cursorState.didReachEnd,
      'Cannot update a cursor that has reached the end of its content',
    );

    cursorState = { ...cursorState, loadState: { type: 'LOADING' } };
    this._cursorStateMap = this._cursorStateMap.set(cursorID, cursorState);
    this._dispatchUpdate();

    // NOTE: Assuming firebase query.
    let query = cursor.query;
    const { cursorRef } = cursorState;

    if (cursorRef) {
      query = query.startAfter(cursorRef);
    }

    query
      .limit(cursor.pageSize)
      .get()
      .then(snapshot => {
        // NOTE: Need to re-query for the cursor and cursor state to see if they
        // changed since we started this query. Could be the case that they were
        // deleted. In that case, we should throw away the results of this query
        // and abandon the operation.
        cursor = this._cursorMap.get(cursorID);
        cursorState = this._cursorStateMap.get(cursorID);

        if (!cursor || !cursorState) {
          return;
        }

        const didReachEnd = snapshot.docs.length < cursor.pageSize;
        const modelIDs = snapshot.docs.map(doc => doc.data().id);
        const idAndModelPairs = snapshot.docs.map(doc => {
          const model = this.constructor.__ModelCtor.fromRaw(doc.data());
          return [model.id, model];
        });

        const cursorRef =
          snapshot.docs.length > 0
            ? snapshot.docs[snapshot.docs.length - 1]
            : null;

        cursorState = {
          ...cursorState,
          cursorRef,
          didReachEnd,
          loadState: { type: 'STEADY' },
          modelIDs: cursorState.modelIDs.concat(Immutable.List(modelIDs)),
        };
        // NOTE: All mutations should be kept in this section here.
        this._collection = this._collection.merge(
          Immutable.Map(idAndModelPairs),
        );
        this._cursorStateMap = this._cursorStateMap.set(cursorID, cursorState);

        this._dispatchUpdate();
      })
      .catch(error => {
        // NOTE: Need to re-query for the cursor and cursor state to see if they
        // changed since we started this query. Could be the case that they were
        // deleted. In that case, we should throw away the results of this query
        // and abandon the operation.
        cursor = this._cursorMap.get(cursorID);
        cursorState = this._cursorStateMap.get(cursorID);

        if (!cursor || !cursorState) {
          return;
        }

        const findiError = FindiError.fromUknownEntity(error);
        cursorState = {
          ...cursorState,
          loadState: { error: findiError, type: 'FAILURE' },
        };

        this._cursorStateMap = this._cursorStateMap.set(cursorID, cursorState);
        this._dispatchUpdate();
      });
  };

  handle = (store: StoreType) => (next: Next) => {
    this._next = next;
    return (action: PureAction) => {
      next(action);

      switch (action.type) {
        case 'MODEL_DELETE_EVERYTHING': {
          const { modelName } = this.constructor.__ModelCtor;
          if (action.modelName === modelName) {
            this._deleteEverything();
            this._dispatchUpdate();
          }
          break;
        }

        case 'MODEL_DELETE_CURSOR': {
          const { modelName } = this.constructor.__ModelCtor;
          if (action.modelName === modelName) {
            this._deleteCursor(action.cursorID);
            this._dispatchUpdate();
          }
          break;
        }

        case 'MODEL_DELETE_LISTENER': {
          const { modelName } = this.constructor.__ModelCtor;
          if (action.modelName === modelName) {
            this._deleteListener(action.listenerID);
            this._dispatchUpdate();
          }
          break;
        }

        case 'MODEL_DELETE_OPERATION': {
          const { modelName } = this.constructor.__ModelCtor;
          if (action.modelName === modelName) {
            this._deleteOperation(action.operationID);
            this._dispatchUpdate();
          }
          break;
        }

        case 'MODEL_FETCH_CURSOR_PAGE': {
          const { modelName } = this.constructor.__ModelCtor;
          if (action.modelName === modelName) {
            this._fetchCursorPageAndDispatchUpdate(action.cursorID);
          }
          break;
        }

        case 'MODEL_SET_AND_RUN_LISTENER': {
          const { modelName } = this.constructor.__ModelCtor;
          if (action.modelName === modelName) {
            // $FlowFixMe = Assuming model names are mutually exclusive.
            const listener: ModelListener<TModelName> = action.listener;
            this._setAndRunListener(listener);
            this._dispatchUpdate();
          }
          break;
        }

        case 'MODEL_SET_AND_RUN_OPERATION': {
          const { modelName } = this.constructor.__ModelCtor;
          if (action.modelName === modelName) {
            // $FlowFixMe = Assuming model names are mutually exclusive.
            const operation: ModelOperation<TModelName> = action.operation;
            this._setAndRunOperation(operation);
            this._dispatchUpdate();
          }
          break;
        }

        case 'MODEL_SET_CURSOR': {
          const { modelName } = this.constructor.__ModelCtor;
          if (action.modelName === modelName) {
            // $FlowFixMe - Assuming model names are mutually exclusive.
            const cursor: ModelCursor<TModelName> = action.cursor;
            this._setCursor(cursor);
            this._dispatchUpdate();
          }
          break;
        }
      }
    };
  };
}
