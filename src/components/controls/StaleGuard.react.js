/* @flow */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { connect } from 'react-redux';

import type { ComponentType } from 'react';
import type { ReduxProps, ReduxState } from '../../typesDEPRECATED/redux';

export type StaleGuardType<TPayload> =
  | {| +type: 'STALE' |}
  | {| +payload: TPayload, +type: 'NOT_STALE' |};

type ReduxMapper<TCompProps: Object, TComputedProps: Object> = (
  ReduxState,
  TCompProps,
) => TComputedProps;

export function withStaleGuard<TProps: Object>(
  Component: ComponentType<TProps>,
): ComponentType<TProps> {
  return (props: TProps) => {
    return <StaleGuard Comp={Component} passThroughProps={props} />;
  };
}

export function connectWithStaleGuard<
  TCompProps: Object,
  TComputedProps: Object,
>(mapper: ReduxMapper<TCompProps, TComputedProps>) {
  return (Component: ComponentType<TCompProps & TComputedProps & ReduxProps>) =>
    connect((reduxState, componentProps) => ({
      Comp: Component,
      componentProps,
      mapper,
      reduxState,
    }))(ConnectedStaleGuard);
}

type StaleProps<TChildProps: Object> = {
  Comp: ComponentType<TChildProps>,
  passThroughProps: TChildProps,
};

class StaleGuard<TChildProps: Object> extends Component<
  StaleProps<TChildProps>,
> {
  shouldComponentUpdate(nextProps: StaleProps<TChildProps>): boolean {
    return !this.context.isStale;
  }

  render() {
    const { Comp } = this.props;
    return <Comp {...this.props.passThroughProps} />;
  }
}

StaleGuard.contextTypes = {
  isStale: PropTypes.bool,
};

type ConnectedStaleProps<
  TCompProps: Object,
  TComputedProps: Object,
> = ReduxProps & {
  Comp: ComponentType<TCompProps & TComputedProps & ReduxProps>,
  componentProps: TCompProps,
  mapper: ReduxMapper<TCompProps, TComputedProps>,
  reduxState: ReduxState,
};

type ConnectedStaleState<TProps: Object> = {
  ActiveComp: ComponentType<TProps & ReduxProps>,
  activeProps: TProps & ReduxProps,
};

class ConnectedStaleGuard<
  TCompProps: Object,
  TComputedProps: Object,
> extends Component<
  ConnectedStaleProps<TCompProps, TComputedProps>,
  ConnectedStaleState<TCompProps & TComputedProps>,
> {
  constructor(props) {
    super(props);
    this.state = {
      ActiveComp: props.Comp,
      activeProps: {
        ...props.componentProps,
        ...props.mapper(props.reduxState, props.componentProps),
        dispatch: props.dispatch,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    setTimeout(() => {
      if (!this.context.isStale) {
        this.setState({
          activeProps: {
            ...this.props.componentProps,
            ...this.props.mapper(
              this.props.reduxState,
              this.props.componentProps,
            ),
            dispatch: this.props.dispatch,
          },
          ActiveComp: this.props.Comp,
        });
      }
    }, 0);
  }

  render() {
    const { ActiveComp, activeProps } = this.state;
    // $FlowFixMe - Not sure why this is an error.
    return <ActiveComp {...activeProps} />;
  }
}

ConnectedStaleGuard.contextTypes = {
  isStale: PropTypes.bool,
};
