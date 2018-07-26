/* @flow */

import * as React from 'react';
import ThemeProvider from './design/components/Theme.react';
import WatchSessionStateUtils from './watch-session/StateUtils';

import { connect } from 'react-redux';

import type { ReduxProps, ReduxState } from './store';
import type { ThemeName } from './design/themes';

export type Props = ReduxProps & ComputedProps & ComponentProps;

type ComponentProps = {
  children: React.ChildrenArray<React.Element<*>>,
};

type ComputedProps = {
  themeName: ThemeName,
};

class CalculateGlobalTheme extends React.Component<Props> {
  render() {
    return (
      <ThemeProvider themeName={this.props.themeName}>
        {React.Children.only(this.props.children)}
      </ThemeProvider>
    );
  }
}

function mapReduxStateToProps(reduxState: ReduxState): ComputedProps {
  return {
    themeName: WatchSessionStateUtils.getIsInWatchSession(reduxState)
      ? 'lightInverted'
      : 'light',
  };
}

export default connect(mapReduxStateToProps)(CalculateGlobalTheme);
