/* @flow */

import * as React from 'react';

import invariant from 'invariant';

import { connect } from 'react-redux';

import type { ReduxState, ReduxProps } from '../store';
import type { ScreenPayload } from './types';

export type Props = ComponentProps & ComputedProps & ReduxProps;

type ComponentProps = {
  calculateScreenForState: (state: ReduxState) => string,
  screens: Array<ScreenPayload>,
};
type ComputedProps = {
  screen: string,
};

class SwitchNavigator extends React.Component<Props> {
  render() {
    const Component = this._getComponent(this.props.screen);
    return <Component />;
  }

  _getComponent(screen: string) {
    const { screens } = this.props;
    const payload = screens.find(payload => payload.screen === screen);
    invariant(payload, 'No component found for screen %s', screen);
    return payload.component;
  }
}

function mapReduxStateToProps(
  state: ReduxState,
  props: ComponentProps,
): ComputedProps {
  return {
    screen: props.calculateScreenForState(state),
  };
}

export default connect(mapReduxStateToProps)(SwitchNavigator);
