/* @flow */

export type Mode = 'AUTH' | 'LOADING' | 'MAIN';

export type Tab = 'ACCOUNTS' | 'HOME';

// TODO: Rename to ControlsPayload
export type Controls = {|
  +mode: Mode,
  +tab: Tab | null,
|};

export type ModeControls = {|
  +setMode: (mode: Mode) => Promise<Mode>,
|};

export type TabControls = {|
  +setTab: (tab: Tab) => Promise<Tab>,
|};

export type NavigatorControls = {||};

export const INITIAL_CONTROLS = {
  mode: 'LOADING',
  tab: null,
};
