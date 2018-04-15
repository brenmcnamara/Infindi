/* @flow */

import Themes from '../themes';
import React, { createContext } from 'react';

import type { ThemeName } from '../themes';

const { Consumer, Provider } = createContext({
  theme: Themes.primary,
});

export type Props = {
  children?: ?any,
  themeName: ThemeName,
};

export default (props: Props) => (
  <Provider value={Themes[props.themeName]}>{props.children}</Provider>
);

console.log(Consumer);

export const GetTheme = Consumer;
