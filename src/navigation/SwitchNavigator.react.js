/* @flow */

import * as React from 'react';

import { connect } from 'react-redux';

import type { ReduxState, ReduxProps } from '../store';

export type Props<TRenderProps: Object> = ComponentProps<TRenderProps> &
  ComputedProps<TRenderProps> &
  ReduxProps;

type ComponentProps<TRenderProps: Object> = {
  children: (renderProps: TRenderProps) => React.Element<*>,
  mapReduxStateToProps: (state: ReduxState) => TRenderProps,
};
type ComputedProps<TRenderProps: Object> = {
  currentRenderProps: TRenderProps,
};
type State<TRenderProps: Object> = {
  prevRenderProps: TRenderProps | null,
};

class SwitchNavigator<TRenderProps: Object> extends React.Component<
  Props<TRenderProps>,
  State<TRenderProps>,
> {
  state: State<TRenderProps> = {
    prevRenderProps: null,
  };

  render() {
    return this.props.children(this.props.currentRenderProps);
  }
}

function mapReduxStateToProps<TRenderProps: Object>(
  state: ReduxState,
  props: ComponentProps<TRenderProps>,
): ComputedProps<TRenderProps> {
  return {
    currentRenderProps: props.mapReduxStateToProps(state),
  };
}

export default connect(mapReduxStateToProps)(SwitchNavigator);
