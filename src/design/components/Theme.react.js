/* @flow */

import Themes from '../themes';
// $FlowFixMe - { createContext } exists as of react version 16.3.1
import React, { createContext } from 'react';

import type { ThemeName } from '../themes';

const { Consumer, Provider } = createContext({
  theme: Themes.light,
});

export type Props = {
  children?: ?any,
  themeName: ThemeName,
};

export default (props: Props) => (
  <Provider value={Themes[props.themeName]}>{props.children}</Provider>
);

export const GetTheme = Consumer;
