/* @flow */

import invariant from 'invariant';

import { AccountsDownloadingBanner, AccountLinkBanner } from '../../../content';
import { clearLoginForm, PROVIDER_LOGIN_MODAL_ID } from '../action';
import { dismissToast, requestToast } from '../../actions/toast';
import { forEachObject } from '../../common/obj-utils';
import { isLinking } from 'common/lib/models/AccountLink';
import { POST_DOWNLOADING_STATUSES, PRE_DOWNLOADING_STATUSES } from '../utils';

import type {
  AccountLink,
  AccountLinkStatus,
} from 'common/lib/models/AccountLink';
import type { ID } from 'common/types/core';
import type { ModelContainer } from '../../datastore';
import type { PureAction, Next, Store } from '../../typesDEPRECATED/redux';
import type { State as ReduxState } from '../../reducers/root';

type AccountLinkContainer = ModelContainer<'AccountLink', AccountLink>;

// const REFRESH_ACCOUNTS_DOWNLOADING_TOAST_ID = 'YODLEE_ACCOUNTS_DOWNLOADING';

type AccountLinkFlowState = {|
  +customMessage?: string,
  +status: AccountLinkStatus,
|};

class AccountLinkFlowManager {
  static _instance: AccountLinkFlowManager | null = null;

  _accountLinkFlowStateMap: { [providerID: ID]: AccountLinkFlowState } = {};
  _next: Next | null = null;
  _store: Store | null = null;

  static getInstance(): AccountLinkFlowManager {
    if (!AccountLinkFlowManager._instance) {
      AccountLinkFlowManager._instance = new AccountLinkFlowManager();
    }
    return AccountLinkFlowManager._instance;
  }

  getMiddlewareHandle() {
    return (store: Store) => (next: Next) => {
      this._store = store;
      this._next = next;
      return (action: PureAction) => {
        this._onAction(action);
      };
    };
  }

  _onAction(action: PureAction): void {
    switch (action.type) {
      case 'CONTAINER_DOWNLOAD_FINISHED': {
        if (action.modelName !== 'AccountLink') {
          break;
        }
        // $FlowFixMe - This is correct
        const container: AccountLinkContainer = action.container;
        forEachObject(container, accountLink => {
          const providerID = accountLink.providerRef.refID;
          const { status } = accountLink;
          const toState = { status };
          this._handleStateChange(providerID, toState);
        });
        break;
      }

      case 'SUBMIT_YODLEE_LOGIN_FORM_INITIALIZE': {
        // NOTE: There is an edge case we are not properly handling here. If
        // a provider sends a long request, we get the banner to show that
        // accounts are downloading. It could be the case that right after this
        // request is sent, before the refresh info for the provider is created
        // we have a refresh of the user's providers that won't include a new
        // refresh for this provider. If none of the refreshes show downloading
        // accounts, then the banner will get dismissed too early. This is
        // probably a very rare edge case and the bug does not result in any
        // serious issues with the app.
        const { providerID } = action;
        const loginFormSource = this._getState().accountVerification
          .loginFormSource[providerID];
        const toStatus =
          loginFormSource === 'ACCOUNT_LINK'
            ? 'MFA / WAITING_FOR_LOGIN_FORM'
            : 'IN_PROGRESS / INITIALIZING';
        const toState = { status: toStatus };
        this._handleStateChange(providerID, toState);
        break;
      }

      case 'SUBMIT_YODLEE_LOGIN_FORM_FAILURE': {
        const { error, providerID } = action;
        // $FlowFixMe - This is correct.
        const errorMessage: string =
          error.error_message ||
          error.message ||
          error.errorMessage ||
          AccountLinkBanner['FAILURE / INTERNAL_SERVICE_FAILURE'];
        const toState = {
          customMessage: errorMessage,
          status: 'FAILURE / INTERNAL_SERVICE_FAILURE',
        };
        this._handleStateChange(providerID, toState);
        break;
      }
    }

    this._callNext(action);
  }

  _handleStateChange(providerID: ID, toState: AccountLinkFlowState): void {
    const fromState = this._accountLinkFlowStateMap[providerID] || null;
    if (fromState && !this._isStateChange(fromState, toState)) {
      return;
    }
    const toStatus = toState.status;
    const text = toState.customMessage || AccountLinkBanner[toStatus];
    this._callNext(requestAccountLinkBanner(providerID, toStatus, text));

    this._accountLinkFlowStateMap[providerID] = toState;
  }

  _isStateChange(
    fromState: AccountLinkFlowState,
    toState: AccountLinkFlowState,
  ): boolean {
    return fromState.status !== toState.status;
  }

  _callNext(...args: *) {
    invariant(
      this._next,
      'Trying to use middleware before it has been linked with redux',
    );
    return this._next.apply(this._next, args);
  }

  _getState(): ReduxState {
    invariant(
      this._store,
      'Trying to use middleware before it has been linked with redux',
    );
    return this._store.getState();
  }
}

export default AccountLinkFlowManager.getInstance().getMiddlewareHandle();

// function requestAccountsDownloadingBanner() {
//   return requestToast({
//     bannerChannel: 'ACCOUNTS',
//     bannerType: 'INFO',
//     id: REFRESH_ACCOUNTS_DOWNLOADING_TOAST_ID,
//     priority: 'LOW',
//     showSpinner: true,
//     text: AccountsDownloadingBanner,
//     toastType: 'BANNER',
//   });
// }

function requestAccountLinkBanner(
  providerID: ID,
  status: AccountLinkStatus,
  text: string,
) {
  const id = `PROVIDERS/${providerID}`;
  return requestToast({
    bannerChannel: id,
    bannerType: status.startsWith('FAILURE')
      ? 'ERROR'
      : status.startsWith('SUCCESS') ? 'SUCCESS' : 'INFO',
    id,
    priority: 'LOW',
    showSpinner:
      status.startsWith('IN_PROGRESS') ||
      status === 'MFA / WAITING_FOR_LOGIN_FORM',
    text,
    toastType: 'BANNER',
  });
}
