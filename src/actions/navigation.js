/* @flow */

import type { ModeControls, TabControls } from '../controls';

export type Action =
  | Action$NavigateToAccounts
  | Action$NavigateToHome
  | Action$SetModeControls
  | Action$SetTabControls;

export type Action$SetModeControls = {|
  +modeControls: ModeControls,
  +type: 'SET_MODE_CONTROLS',
|};

export function setModeControls(modeControls: ModeControls) {
  return { modeControls, type: 'SET_MODE_CONTROLS' };
}

export type Action$SetTabControls = {|
  +tabControls: TabControls,
  +type: 'SET_TAB_CONTROLS',
|};

export function setTabControls(tabControls: TabControls) {
  return { tabControls, type: 'SET_TAB_CONTROLS' };
}

export type Action$NavigateToHome = {|
  +type: 'NAVIGATE_TO_HOME',
|};

export function navigateToHome() {
  return { type: 'NAVIGATE_TO_HOME' };
}

export type Action$NavigateToAccounts = {|
  +type: 'NAVIGATE_TO_ACCOUNTS',
|};

export function navigateToAccounts() {
  return { type: 'NAVIGATE_TO_ACCOUNTS' };
}
