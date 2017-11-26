/* @flow */

export type NavigatorProps = {
  navigator: NavigatorScreenAPI,
};

export type NavigatorScreenAPI = {
  +addOnNavigatorEvent: (cb: NavigatorEventCallback) => void,

  +setOnNavigatorEvent: (cb: NavigatorEventCallback) => void,

  +toggleDrawer: ({
    animated: bool,
    side: 'left' | 'right',
    to?: 'open' | 'closed',
  }) => void,
};

export type NavigatorEventCallback = (event: NavigatorEvent) => any;

export type NavigatorEvent = NavigatorEvent$NavBarButtonPress | Object;

export type NavigatorEvent$NavBarButtonPress = {
  id: string,
  type: 'NavBarButtonPress',
};
