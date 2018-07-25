/* @flow */

import AccountLinkStateUtils from '../../data-model/state-utils/AccountLink';

import invariant from 'invariant';

import { AccountLinkBanner } from '../../../content';
import {
  dismissLoginFormModal,
  exitAccountVerification,
  requestLoginFormModal,
} from '../action';
import { requestMultipleToasts } from '../../actions/toast';
import { forEachObject } from '../../common/obj-utils';
import { ReduxMiddleware } from '../../common/redux-utils';

import type { AccountLinkStatus } from 'common/lib/models/AccountLink';
import type { ID } from 'common/types/core';
import type { State as ReduxState } from '../../reducers/root';
import type { Toast$Banner } from '../../reducers/toast';

type ProviderData = {|
  +isViewingLoginScreen: boolean,
  +loginFormSource: 'PROVIDER' | 'ACCOUNT_LINK' | null,
  +pendingRequest: 'LOGIN' | 'MFA' | 'FAILURE' | null,
  +providerID: ID,
  +shouldShowLoginFormModal: boolean,
  +status: AccountLinkStatus | null,
|};

type State = {|
  +providerDataMap: { [providerID: ID]: ProviderData },
|};

function calculateState(reduxState: ReduxState): State {
  const accountLinks = AccountLinkStateUtils.getCollection(reduxState);
  const accountVerificationPage = reduxState.accountVerification.page;
  const selectedProviderID =
    accountVerificationPage &&
    accountVerificationPage.type === 'LOGIN' &&
    accountVerificationPage.providerID;

  const { providerPendingLoginRequestMap } = reduxState.accountVerification;

  const providerDataMap = {};

  // Loop through providers. There could be providers that do not have
  // account links.
  reduxState.providerFuzzySearch.orderedCollection.forEach(provider => {
    providerDataMap[provider.id] = {
      isViewingLoginScreen: selectedProviderID === provider.id,
      pendingRequest: providerPendingLoginRequestMap[provider.id] || null,
      providerID: provider.id,
      shouldShowLoginFormModal: false,
      status: null,
    };
  });

  // We can override providerStateMap values in this second pass. The data
  // from the account links has higher priority.
  accountLinks.forEach(accountLink => {
    const providerID = accountLink.providerRef.refID;
    const isViewingLoginScreen = selectedProviderID === providerID;
    providerDataMap[providerID] = {
      isViewingLoginScreen,
      pendingRequest: providerPendingLoginRequestMap[providerID] || null,
      providerID,
      shouldShowLoginFormModal: !isViewingLoginScreen && accountLink.isInMFA,
      status: accountLink.status,
    };
  });

  return { providerDataMap };
}

export default class AccountLinkFlowMiddleware extends ReduxMiddleware<State> {
  _bannerBuffer: Array<Toast$Banner> = [];

  static __calculateInitialState = calculateState;
  static __calculateStatePostAction = calculateState;

  __didUpdateState = (currentState: State, prevState: State): void => {
    const prevProviderDataMap = prevState.providerDataMap;
    const currentProviderDataMap = currentState.providerDataMap;

    // Iterate through update and created provider data objects.
    forEachObject(currentProviderDataMap, (toProviderData, providerID) => {
      const fromProviderData = prevProviderDataMap[providerID] || null;
      this._handleProviderDataChange(
        providerID,
        fromProviderData,
        toProviderData,
      );
    });

    // Iterate through removed provider data objects.
    forEachObject(prevProviderDataMap, (fromProviderData, providerID) => {
      if (!currentProviderDataMap[providerID]) {
        this._handleProviderDataChange(providerID, fromProviderData, null);
      }
    });

    // TODO: Look into a better batching process.
    // 1) Does something exist out-of-the-box with redux?
    // 2) 3rd party middleware?
    // 3) A way for the banner handling middleware to automatically do batching.
    //    Could design a "redux middleware" class that will automatically
    //    perform batching for certain types of actions.
    if (this._bannerBuffer.length > 0) {
      this.__dispatch(requestMultipleToasts(this._bannerBuffer));
      this._bannerBuffer = [];
    }
  };

  _handleProviderDataChange(
    providerID: ID,
    fromProviderData: ProviderData | null,
    toProviderData: ProviderData | null,
  ): void {
    const fromStatus = calculateDerivedAccountLinkStatus(fromProviderData);
    const toStatus = calculateDerivedAccountLinkStatus(toProviderData);

    if (fromStatus === toStatus) {
      return;
    }

    if (toStatus) {
      invariant(
        toProviderData,
        'Expecting toProviderData to exist: %s',
        providerID,
      );
      this._bannerBuffer.push(createAccountLinkBanner(providerID, toStatus));
      if (toStatus === 'IN_PROGRESS / DOWNLOADING_DATA') {
        this.__dispatch(exitAccountVerification());
      }
    }

    const isShowingLoginForm =
      fromProviderData && fromProviderData.shouldShowLoginFormModal;
    const shouldShowLoginForm =
      toProviderData && toProviderData.shouldShowLoginFormModal;

    if (isShowingLoginForm && !shouldShowLoginForm) {
      this.__dispatch(dismissLoginFormModal(providerID));
    } else if (!isShowingLoginForm && shouldShowLoginForm) {
      this.__dispatch(requestLoginFormModal(providerID));
    }
  }
}

// TODO: I don't like this, it is confusing, should try to remove it.
function calculateDerivedAccountLinkStatus(
  providerState: ProviderData | null,
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
