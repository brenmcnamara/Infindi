/* @flow */

export type Mode = 'AUTH' | 'LOADING' | 'MAIN';

export type Tab = 'ACCOUNTS' | 'HOME';

// TODO: Rename to ControlsPayload
export type Controls = {|
  +mode: Mode,
  +tab?: Tab,
|};

export type ModeControls = {|
  +setMode: (mode: Mode) => void,
|};

export type TabControls = {|
  +setTab: (tab: Tab) => void,
|};

export type NavigatorControls = {||};

export const INITIAL_CONTROLS = {
  mode: 'MAIN',
  tab: 'HOME',
};
