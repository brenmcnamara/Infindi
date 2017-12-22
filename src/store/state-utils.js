/* @flow */

import invariant from 'invariant';

import type { AuthStatus } from '../reducers/authStatus';
import type { LoginPayload } from 'common/src/types/db';
import type { Mode } from '../controls';
import type { State } from '../reducers/root';

// -----------------------------------------------------------------------------
//
// QUERY REDUX STATE
//
// -----------------------------------------------------------------------------

export function isAuthenticated(state: State): bool {
  return state.authStatus.type === 'LOGGED_IN';
}

export function getLoginPayload(state: State): ?LoginPayload {
  if (state.authStatus.type !== 'LOGGED_IN') {
    return null;
  }
  return state.authStatus.loginPayload;
}

export function getLatestMode(state: State): Mode {
  const { navState } = state;
  return navState.transitionStatus === 'COMPLETE'
    ? navState.controlsPayload.mode
    : navState.incomingControlsPayload.mode;
}

export function getUserFirstName(state: State): ?string {
  const loginPayload = getLoginPayload(state);
  if (!loginPayload) {
    return null;
  }
  return loginPayload.userInfo.firstName;
}

export function getMode(state: State): Mode {
  const { configState } = state;
  if (configState.envStatus === 'ENV_LOADING') {
    return 'LOADING';
  }

  return getModeForAuthStatus(state.authStatus);
}

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

function getModeForAuthStatus(authStatus: AuthStatus): Mode {
  switch (authStatus.type) {
    case 'LOGIN_INITIALIZE':
    case 'LOGIN_FAILURE':
    case 'LOGOUT_INITIALIZE':
    case 'LOGOUT_FAILURE':
    case 'LOGGED_OUT':
      return 'AUTH';
    case 'LOGGED_IN':
      return 'MAIN';
    case 'NOT_INITIALIZED':
      return 'LOADING';
  }
  invariant(false, 'Unrecognized auth status: %s', authStatus.type);
}
