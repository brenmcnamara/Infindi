/* @flow */

import invariant from 'invariant';

import type { Action as AllActions, Store } from '../types/redux';
import type { Controls, ModeControls, TabControls } from '../controls';

export type Action = Action$SetControls;

export type Action$SetControls = {|
  +controls: Controls,
  +type: 'SET_CONTROLS',
|};

/**
 * Navigation middleware handles app transitions from one view to another.
 * This component keeps track of where we are in the app, and performs
 * the necessary transitions to get to the next point of the app.
 */
export default (store: Store) => (next: Function) => {
  let modeControls: ?ModeControls = null;
  let tabControls: ?TabControls = null;

  function getModeControls(): ModeControls {
    invariant(modeControls, 'Expecting mode controls to be set');
    return modeControls;
  }

  function getTabControls(): TabControls {
    invariant(tabControls, 'Expecting tab controls to be set');
    return tabControls;
  }

  return (action: AllActions) => {
    next(action);

    switch (action.type) {
      case 'NAVIGATE_TO_ACCOUNTS': {
        getTabControls().setTab('ACCOUNTS');
        break;
      }

      case 'NAVIGATE_TO_HOME': {
        getTabControls().setTab('HOME');
        break;
      }

      case 'SET_MODE_CONTROLS': {
        modeControls = action.modeControls;
        break;
      }

      case 'SET_TAB_CONTROLS': {
        tabControls = action.tabControls;
        break;
      }
    }
  };
};
