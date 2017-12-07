/* @flow */

import invariant from 'invariant';

import type { Next, PureAction, Store } from '../types/redux';
import type { AuthStatus } from '../reducers/authStatus';
import type {
  Controls,
  Mode,
  ModeControls,
  Tab,
  TabControls,
} from '../controls';

export type Action = Action$SetControls;

export type Action$SetControls = {|
  +controls: Controls,
  +transitionStatus: 'IN_PROGRESS' | 'COMPLETE',
  +type: 'SET_CONTROLS',
|};

/**
 * Navigation middleware handles app transitions from one view to another.
 * This component keeps track of where we are in the app, and performs
 * the necessary transitions to get to the next point of the app.
 */
export default (store: Store) => (next: Next) => {
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

  return (action: PureAction) => {
    const navControls = store.getState().navControls;
    const currentControls =
      navControls.transitionStatus === 'IN_PROGRESS'
        ? navControls.previousControls
        : navControls.controls;
    next(action);

    switch (action.type) {
      case 'AUTH_STATUS_CHANGE': {
        const currentMode = currentControls.mode;
        const nextMode = getModeFromAuthStatus(action.status);
        if (currentMode !== nextMode) {
          const nextTab = nextMode === 'MAIN' ? 'HOME' : null;
          const newControls = { mode: nextMode, tab: nextTab };
          // NOTE: There could be a race condition here. Hoping that redux will
          // dispatch the IN_PROGRESS controls before getModeControls is applied
          // but may need a more robust way to do this.
          next({
            type: 'SET_CONTROLS',
            transitionStatus: 'IN_PROGRESS',
            controls: newControls,
          });
          getModeControls()
            .setMode(nextMode)
            .then(newMode => {
              invariant(
                newMode === nextMode,
                'Expected mode to be set to %s. Actual: %s',
                nextMode,
                newMode,
              );
              next({
                controls: newControls,
                transitionStatus: 'COMPLETE',
                type: 'SET_CONTROLS',
              });
            });
        }
        break;
      }

      case 'NAVIGATE_TO_ACCOUNTS': {
        // NOTE: There could be a race condition here. Hoping that redux will
        // dispatch the IN_PROGRESS controls before getTabControls is applied
        // but may need a more robust way to do this.
        next({
          controls: { mode: currentControls.mode, tab: 'ACCOUNTS' },
          transitionStatus: 'IN_PROGRESS',
          type: 'SET_CONTROLS',
        });
        getTabControls()
          .setTab('ACCOUNTS')
          .then((newTab: Tab) => {
            invariant(
              newTab === 'ACCOUNTS',
              'Expected tab to be %s. Actual: %s',
              'ACCOUNTS',
              newTab,
            );
            next({
              controls: { mode: currentControls.mode, tab: 'ACCOUNTS' },
              transitionStatus: 'COMPLETE',
              type: 'SET_CONTROLS',
            });
          });
        break;
      }

      case 'NAVIGATE_TO_HOME': {
        const newControls = { mode: currentControls.mode, tab: 'HOME' };
        // NOTE: There could be a race condition here. Hoping that redux will
        // dispatch the IN_PROGRESS controls before getModeControls is applied
        // but may need a more robust way to do this.
        next({
          controls: newControls,
          transitionStatus: 'IN_PROGRESS',
          type: 'SET_CONTROLS',
        });
        getTabControls()
          .setTab('HOME')
          .then((newTab: Tab) => {
            invariant(
              newTab === 'HOME',
              'Expected tab to be %s. Actual: %s',
              'HOME',
              newTab,
            );
            next({
              controls: newControls,
              transitionStatus: 'COMPLETE',
              type: 'SET_CONTROLS',
            });
          });
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

function getModeFromAuthStatus(authStatus: AuthStatus): Mode {
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
