/* @flow */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import type { ComponentType } from 'react';

export type StaleGuardType<TPayload> =
  | {| +type: 'STALE' |}
  | {| +payload: TPayload, +type: 'NOT_STALE' |};

export function withStaleGuard<TProps: Object>(
  Component: ComponentType<TProps>,
): ComponentType<TProps> {
  return (props: TProps) => {
    return <StaleGuard Comp={Component} passThroughProps={props} />;
  };
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
    return (
      <Comp {...this.props.passThroughProps} />
    );
  }
}

StaleGuard.contextTypes = {
  isStale: PropTypes.bool,
};
