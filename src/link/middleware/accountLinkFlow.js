/* @flow */

import invariant from 'invariant';

import { AccountLinkBanner } from '../../../content';
import {
  clearLoginForm,
  dismissLoginFormModal,
  exitAccountVerification,
  requestLoginFormModal,
} from '../action';
import { requestMultipleToasts } from '../../actions/toast';
import { forEachObject } from '../../common/obj-utils';
import { getContainer } from '../../datastore';

import type { AccountLinkStatus } from 'common/lib/models/AccountLink';
import type { ID } from 'common/types/core';
import type { PureAction, Next, StoreType } from '../../store';
import type { State as ReduxState } from '../../reducers/root';
import type { Toast$Banner } from '../../reducers/toast';

const ACTION_BLACKLIST = [];

type ProviderState = {|
  +isViewingLoginScreen: boolean,
  +loginFormSource: 'PROVIDER' | 'ACCOUNT_LINK' | null,
  +pendingRequest: 'LOGIN' | 'MFA' | 'FAILURE' | null,
  +providerID: ID,
  +shouldShowLoginFormModal: boolean,
  +status: AccountLinkStatus | null,
|};

class AccountLinkFlowManager {
  static _instance: AccountLinkFlowManager | null = null;

  _bannerBuffer: Array<Toast$Banner> = [];
  _next: Next | null = null;
  _providerStateMap: { [providerID: ID]: ProviderState } = {};
  _store: StoreType | null = null;

  static getInstance(): AccountLinkFlowManager {
    if (!AccountLinkFlowManager._instance) {
      AccountLinkFlowManager._instance = new AccountLinkFlowManager();
    }
    return AccountLinkFlowManager._instance;
  }

  getMiddlewareHandle() {
    return (store: StoreType) => (next: Next) => {
      this._store = store;
      this._next = next;
      return (action: PureAction) => {
        this._onAction(action);
      };
    };
  }

  _onAction(action: PureAction): void {
    this._callNext(action);

    // Optimization: Blacklist any actions that we know will not have any affect
    // on this middleware to help remove unneeded computations.
    if (ACTION_BLACKLIST.includes(action.type)) {
      return;
    }

    const postActionState = this._getState();

    // STEP 1: GET THE UPDATED LOCAL STATE GIVEN THE CURRENT REDUX STATE.

    const accountLinkContainer =
      getContainer(postActionState.accountLinks) || {};
    const accountVerificationPage = postActionState.accountVerification.page;
    const selectedProviderID =
      accountVerificationPage &&
      accountVerificationPage.type === 'LOGIN' &&
      accountVerificationPage.providerID;
    const {
      providerPendingLoginRequestMap,
    } = postActionState.accountVerification;

    const providerStateMap = {};

    // Loop through providers. There could be providers that do not have
    // account links.
    forEachObject(postActionState.providers.container, provider => {
      providerStateMap[provider.id] = {
        isViewingLoginScreen: selectedProviderID === provider.id,
        pendingRequest: providerPendingLoginRequestMap[provider.id] || null,
        providerID: provider.id,
        shouldShowLoginFormModal: false,
        status: null,
      };
    });

    forEachObject(accountLinkContainer, accountLink => {
      const providerID = accountLink.providerRef.refID;
      const isViewingLoginScreen = selectedProviderID === providerID;
      providerStateMap[providerID] = {
        isViewingLoginScreen,
        pendingRequest: providerPendingLoginRequestMap[providerID] || null,
        providerID,
        shouldShowLoginFormModal: !isViewingLoginScreen && accountLink.isInMFA,
        status: accountLink.status,
      };
    });

    // STEP 2: PERFORM THE UPDATES GOING FROM THE PREVIOUS STATE TO THE NEXT
    // STATE.

    // Loop through the provider states that were updated / created.
    forEachObject(providerStateMap, (toProviderState, providerID) => {
      const fromProviderState = this._providerStateMap[providerID] || null;
      this._handleProviderStateChange(
        providerID,
        fromProviderState,
        toProviderState,
      );
    });

    // Loop through the provider states that were deleted.
    forEachObject(this._providerStateMap, (fromProviderState, providerID) => {
      if (!providerStateMap[providerID]) {
        this._handleProviderStateChange(providerID, fromProviderState, null);
      }
    });

    // Batch update any banners.
    if (this._bannerBuffer.length > 0) {
      this._callNext(requestMultipleToasts(this._bannerBuffer));
    }
    this._bannerBuffer = [];

    // STEP 3: UPDATE THE LOCAL STATE.
    this._providerStateMap = providerStateMap;
  }

  _handleProviderStateChange(
    providerID: ID,
    fromProviderState: ProviderState | null,
    toProviderState: ProviderState | null,
  ): void {
    const fromStatus = calculateDerivedAccountLinkStatus(fromProviderState);
    const toStatus = calculateDerivedAccountLinkStatus(toProviderState);

    if (fromStatus === toStatus) {
      return;
    }

    if (toStatus) {
      invariant(
        toProviderState,
        'Expecting toProviderState to exist: %s',
        providerID,
      );
      this._bannerBuffer.push(createAccountLinkBanner(providerID, toStatus));
      if (toStatus === 'IN_PROGRESS / DOWNLOADING_DATA') {
        if (toProviderState.isViewingLoginScreen) {
          this._callNext(exitAccountVerification());
        }
        this._callNext(clearLoginForm(providerID));
      }
    }

    const isShowingLoginForm =
      fromProviderState && fromProviderState.shouldShowLoginFormModal;
    const shouldShowLoginForm =
      toProviderState && toProviderState.shouldShowLoginFormModal;
    if (isShowingLoginForm && !shouldShowLoginForm) {
      this._callNext(dismissLoginFormModal(providerID));
    } else if (!isShowingLoginForm && shouldShowLoginForm) {
      this._callNext(requestLoginFormModal(providerID));
    }
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

function calculateDerivedAccountLinkStatus(
  providerState: ProviderState | null,
): AccountLinkStatus | null {
  if (!providerState) {
    return null;
  }
  if (providerState.pendingRequest === 'LOGIN') {
    return 'IN_PROGRESS / INITIALIZING';
  } else if (providerState.pendingRequest === 'MFA') {
    return 'MFA / WAITING_FOR_LOGIN_FORM';
  } else if (providerState.pendingRequest === 'FAILURE') {
    return 'FAILURE / INTERNAL_SERVICE_FAILURE';
  }

  return providerState.status;
}

function createAccountLinkBanner(providerID: ID, status: AccountLinkStatus) {
  const id = `PROVIDERS/${providerID}`;
  return {
    bannerChannel: id,
    bannerType: status.startsWith('FAILURE')
      ? 'ALERT'
      : status.startsWith('SUCCESS')
        ? 'SUCCESS'
        : 'INFO',
    id,
    priority: 'LOW',
    showSpinner:
      status.startsWith('IN_PROGRESS') ||
      status === 'MFA / WAITING_FOR_LOGIN_FORM',
    text: AccountLinkBanner[status],
    toastType: 'BANNER',
  };
}
