/* @flow */

import Themes from '../themes';
// $FlowFixMe - { createContext } exists as of react version 16.3.1
import React, { createContext } from 'react';

import type { ComponentType } from 'react';
import type { Theme, ThemeName } from '../themes';

const { Consumer, Provider } = createContext({
  theme: Themes.light,
});

export type Props = {
  children?: ?any,
  themeName: ThemeName,
};
export type ThemeProps = {
  theme: Theme,
};

export default (props: Props) => (
  <Provider value={Themes[props.themeName]}>{props.children}</Provider>
);

export const GetTheme = Consumer;

export function GetThemeHOC<TProps: Object>(
  Component: ComponentType<TProps & ThemeProps>,
): ComponentType<TProps & ThemeProps> {
  return (props: TProps) => {
    return (
      <GetTheme>{theme => <Component {...props} theme={theme} />}</GetTheme>
    );
  };
}
