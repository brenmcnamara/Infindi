/* @flow */

import AccountsScreen from '../AccountsScreen.react';
import Navigator from './Navigator.react';
import React, { Component } from 'react';

import invariant from 'invariant';

import type { RouteNode } from '../../common/route-utils';

export type Props = {
  routeNode: RouteNode,
};

export default class Tabs extends Component<Props> {
  componentDidMount(): void {
    invariant(
      this.props.routeNode.name === 'ACCOUNTS',
      'Expecting route node to be of type ACCOUNTS',
    );
  }

  componentWillReceiveProps(nextProps: Props) {
    invariant(
      this.props.routeNode.name === 'ACCOUNTS',
      'Expecting route node to be of type ACCOUNTS',
    );
  }

  render() {
    return (
      <Navigator
        payload={{ component: AccountsScreen, couldBeScrollable: true }}
      />
    );
  }
}
