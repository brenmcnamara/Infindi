/* @flow */

import invariant from 'invariant';

import type { ID } from 'common/types/core';
import type { PureAction } from '../typesDEPRECATED/redux';

export type TransactionLoadingStatus =
  | 'EMPTY'
  | 'LOADING'
  | 'STEADY'
  | 'END_OF_INPUT'
  | 'FAILURE';

export type State = {
  +accountToLoadingStatus: AccountToLoadingStatusMap,
  +operationToAccountID: OperationToAccountIDMap,
};

type AccountToLoadingStatusMap = { [accountID: ID]: TransactionLoadingStatus };
type OperationToAccountIDMap = { [operationID: ID]: ID };

const DEFAULT_STATE: State = {
  accountToLoadingStatus: {},
  operationToAccountID: {},
};

export default function transactionLoading(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'CONTAINER_DOWNLOAD_START': {
      if (action.modelName !== 'Transaction') {
        break;
      }
      invariant(
        !state.operationToAccountID[action.operationID],
        'Cannot start a container download with an operation id that is already running: %s',
        action.operationID,
      );
      invariant(
        action.downloadInfo && action.downloadInfo.accountID,
        'Expecting transaction download to contain accountID in downloadInfo',
      );
      const { accountID } = action.downloadInfo;
      return {
        ...state,
        accountToLoadingStatus: addLoadingStatus(
          state.accountToLoadingStatus,
          accountID,
          'LOADING',
        ),
        operationToAccountID: addOperationToAccountID(
          state.operationToAccountID,
          action.operationID,
          accountID,
        ),
      };
    }

    case 'CONTAINER_DOWNLOAD_FINISHED':
    case 'CONTAINER_DOWNLOAD_FAILURE': {
      if (action.modelName !== 'Transaction') {
        break;
      }
      const accountID = state.operationToAccountID[action.operationID];
      invariant(
        accountID,
        'Cannot fail an operation that does not exist: %s',
        action.operationID,
      );
      const loadingStatus =
        action.type === 'CONTAINER_DOWNLOAD_FAILURE' ? 'FAILURE' : 'STEADY';

      return {
        ...state,
        accountToLoadingStatus: addLoadingStatus(
          state.accountToLoadingStatus,
          accountID,
          loadingStatus,
        ),
        operationToAccountID: removeOperationID(
          state.operationToAccountID,
          action.operationID,
        ),
      };
    }
  }
  return state;
}

function addLoadingStatus(
  map: AccountToLoadingStatusMap,
  accountID: ID,
  loadingStatus: TransactionLoadingStatus,
): AccountToLoadingStatusMap {
  return {
    ...map,
    [accountID]: loadingStatus,
  };
}

function addOperationToAccountID(
  map: OperationToAccountIDMap,
  operationID: ID,
  accountID: ID,
): OperationToAccountIDMap {
  return {
    ...map,
    [operationID]: accountID,
  };
}

function removeOperationID(
  map: OperationToAccountIDMap,
  operationID: ID,
): OperationToAccountIDMap {
  const newMap = { ...map };
  delete newMap[operationID];
  return newMap;
}
