/* @flow */

import AccountsScreen from '../AccountsScreen.react';
import Colors from '../../design/colors';
import Icons from '../../design/icons';
import React, { Component } from 'react';

import invariant from 'invariant';

import { connect } from 'react-redux';
import { NavigatorIOS } from 'react-native';
import { requestLeftPane } from '../../actions/modal';

import type { ReduxProps } from '../../typesDEPRECATED/redux';
import type { RouteNode } from '../../common/route-utils';

export type Props = ReduxProps & {
  routeNode: RouteNode,
};

class Tabs extends Component<Props> {
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
    const Component = AccountsScreen;
    const couldBeScrollable = this.props.routeNode.name === 'ACCOUNTS';
    return (
      <NavigatorIOS
        initialRoute={{
          barTintColor: Colors.BACKGROUND,
          component: Component,
          leftButtonIcon: Icons.List,
          onLeftButtonPress: this._onPressLeftButton,
          shadowHidden: !couldBeScrollable,
          tintColor: Colors.NAV_BAR_BUTTON,
          title: '',
        }}
        style={{ flex: 1 }}
      />
    );
  }

  _onPressLeftButton = (): void => {
    this.props.dispatch(requestLeftPane());
  };
}

export default connect()(Tabs);
