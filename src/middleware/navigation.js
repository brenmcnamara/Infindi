/* @flow */

import invariant from 'invariant';

import { getMode } from '../store/state-utils';

import type { Next, PureAction, Store } from '../typesDEPRECATED/redux';
import type {
  ControlsPayload,
  ModeControls,
  Tab,
  TabControls,
} from '../controls';

export type Action = Action$SetControls;

export type Action$SetControls = {|
  +controlsPayload: ControlsPayload,
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
    const navState = store.getState().navState;
    const currentControlsPayload =
      navState.transitionStatus === 'IN_PROGRESS'
        ? navState.previousControlsPayload
        : navState.controlsPayload;
    next(action);

    switch (action.type) {
      // Keep track of actions that may cause a change in the mode.
      // TODO: In the future, we may want to just check for the current and
      // next mode of the state, and not only do that under certain actions.
      case 'AUTH_STATUS_CHANGE':
      case 'ENV_STATUE_CHANGE': {
        const currentMode = currentControlsPayload.mode;
        const nextMode = getMode(store.getState());
        if (currentMode === nextMode) {
          return;
        }
        const nextTab = nextMode === 'MAIN' ? 'HOME' : null;
        const newControlsPayload = { mode: nextMode, tab: nextTab };
        // NOTE: There could be a race condition here. Hoping that redux will
        // dispatch the IN_PROGRESS controls before getModeControls is applied
        // but may need a more robust way to do this.
        next({
          controlsPayload: newControlsPayload,
          transitionStatus: 'IN_PROGRESS',
          type: 'SET_CONTROLS',
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
              controlsPayload: newControlsPayload,
              transitionStatus: 'COMPLETE',
              type: 'SET_CONTROLS',
            });
          });
        break;
      }

      case 'NAVIGATE_TO_ACCOUNTS': {
        // NOTE: There could be a race condition here. Hoping that redux will
        // dispatch the IN_PROGRESS controls before getTabControls is applied
        // but may need a more robust way to do this.
        next({
          controlsPayload: {
            mode: currentControlsPayload.mode,
            tab: 'ACCOUNTS',
          },
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
              controlsPayload: {
                mode: currentControlsPayload.mode,
                tab: 'ACCOUNTS',
              },
              transitionStatus: 'COMPLETE',
              type: 'SET_CONTROLS',
            });
          });
        break;
      }

      case 'NAVIGATE_TO_HOME': {
        const newControls = { mode: currentControlsPayload.mode, tab: 'HOME' };
        // NOTE: There could be a race condition here. Hoping that redux will
        // dispatch the IN_PROGRESS controls before getModeControls is applied
        // but may need a more robust way to do this.
        next({
          controlsPayload: newControls,
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
              controlsPayload: newControls,
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
