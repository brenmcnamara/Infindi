/* @flow */

import invariant from 'invariant';

import type { Next, PureAction, ReduxState, StoreType } from '../store';

export type ActionPhase = 'PRE-ACTION' | 'POST-ACTION';

export class ReduxMiddleware<TState> {
  _state: TState;
  _next: Next | null = null;

  // ---------------------------------------------------------------------------
  //
  // OVERRIDE THESE METHODS
  //
  // ---------------------------------------------------------------------------

  static __calculateInitialState: (reduxState: ReduxState) => TState = () => {
    invariant(
      false,
      'Expecting subclass of ReduxMiddleware to define __calculateInitialState',
    );
  };

  // TODO: MARK THIS METHOD AS UNSAFE. COULD BE FETCHING INCOMPLETE UPDATES.
  // eslint-disable-next-line flowtype/space-after-type-colon
  static __calculateStatePreAction:
    | ((
        reduxState: ReduxState,
        prevState: TState,
        action: PureAction,
      ) => TState)
    | null = null;

  // eslint-disable-next-line flowtype/space-after-type-colon
  static __calculateStatePostAction:
    | ((
        reduxState: ReduxState,
        prevState: TState,
        action: PureAction,
      ) => TState)
    | null = null;

  static __shouldPropagateAction: (
    action: PureAction,
    state: TState,
  ) => boolean = () => true;

  __initialize: () => void = () => {};

  __didUpdateState: (
    currentState: TState,
    prevState: TState,
    phase: ActionPhase,
  ) => void | Promise<void> = () => {};

  // ---------------------------------------------------------------------------
  //
  // DO NOT OVERRIDE
  //
  // ---------------------------------------------------------------------------

  __dispatch = (action: PureAction) => {
    invariant(
      this._next,
      'Cannot call __dispatch on Middleware before it has been applied to redux',
    );
    this._next(action);
  };

  handle = (store: StoreType) => (next: Next) => {
    this._state = this.constructor.__calculateInitialState(store.getState());
    this._next = next;
    this.__initialize();

    return (action: PureAction) => {
      const {
        __calculateStatePreAction,
        __calculateStatePostAction,
      } = this.constructor;

      if (__calculateStatePreAction) {
        const prevState = this._state;
        const preActionState = __calculateStatePreAction(
          store.getState(),
          prevState,
          action,
        );
        this._state = preActionState;
        this.__didUpdateState(this._state, prevState, 'PRE-ACTION');
      }

      if (!this.constructor.__shouldPropagateAction(action, this._state)) {
        return;
      }

      next(action);

      if (__calculateStatePostAction) {
        const prevState = this._state;
        const postActionState = __calculateStatePostAction(
          store.getState(),
          prevState,
          action,
        );
        this._state = postActionState;
        this.__didUpdateState(this._state, prevState, 'POST-ACTION');
      }
    };
  };
}
