/* @flow */

import AccountDetailsScreen from '../AccountDetailsScreen.react';
import AccountsScreen from '../AccountsScreen.react';
import Icons from '../../design/icons';
import React, { Component } from 'react';

import invariant from 'invariant';

import { connect } from 'react-redux';
import { exitAccountDetails } from '../../actions/router';
import { NavigatorIOS } from 'react-native';
import { requestLeftPane } from '../../actions/modal';

import type { ReduxProps } from '../../typesDEPRECATED/redux';
import type { RouteNode } from '../../common/route-utils';

export type Props = ReduxProps & {
  routeNode: RouteNode,
  theme: Theme,
};

class Tabs extends Component<Props> {
  _shouldAllowBackButton: boolean = true;

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

    const didShowAccountDetails = getIsShowingAccountDetails(
      this.props.routeNode,
    );
    const willShowAccountDetails = getIsShowingAccountDetails(
      nextProps.routeNode,
    );
    if (didShowAccountDetails && !willShowAccountDetails) {
      this.refs.nav.pop();
    } else if (!didShowAccountDetails && willShowAccountDetails) {
      this._shouldAllowBackButton = false;
      // NOTE: We are doing this in order to prevent the user from hitting the
      // back button and popping this view before it has completed animated in.
      // Doing this would result in the screen getting stuck on account details.
      // Would like to abstract this away at some point.
      setTimeout(() => (this._shouldAllowBackButton = true), 1000);
      this.refs.nav.push({
        barTintColor: this.props.theme.color.backgroundApp,
        component: AccountDetailsScreen,
        leftButtonIcon: Icons.LeftArrow,
        onLeftButtonPress: () => {
          this._shouldAllowBackButton &&
            this.props.dispatch(exitAccountDetails());
        },
        passProps: {
          accountID: getAccountDetailsAccountID(nextProps.routeNode),
        },
        tintColor: this.props.theme.color.buttonNavBar,
        title: '',
      });
    }
  }

  render() {
    const Component = AccountsScreen;
    const couldBeScrollable = this.props.routeNode.name === 'ACCOUNTS';
    return (
      <NavigatorIOS
        initialRoute={{
          barTintColor: this.props.theme.color.backgroundApp,
          component: Component,
          leftButtonIcon: Icons.List,
          onLeftButtonPress: this._onPressLeftButton,
          shadowHidden: !couldBeScrollable,
          tintColor: this.props.theme.color.buttonNavBar,
          title: '',
        }}
        ref="nav"
        style={{ flex: 1 }}
      />
    );
  }

  _onPressLeftButton = (): void => {
    this.props.dispatch(requestLeftPane());
  };
}

// TODO: This manual fetching of account details screen info is not scalable.
// Will make this generic. The current idea is to have a separate component,
// like a navigator component that can assign and node name to a component
// and render the list of components to stack into the navigator, pushing and
// popping when necessary. This is too much abstraction for the moment, so
// we're settling with something simple and "good enough"
function getIsShowingAccountDetails(tabNode: RouteNode) {
  return tabNode.next && tabNode.next.name === 'ACCOUNT_DETAILS';
}

function getAccountDetailsAccountID(tabNode: RouteNode): string {
  const accountDetailsNode = tabNode.next;
  invariant(
    accountDetailsNode && accountDetailsNode.name === 'ACCOUNT_DETAILS',
    'Expecting the immediate child of the tabs node to be the accountDetails node: %s',
    accountDetailsNode && accountDetailsNode.name,
  );

  invariant(
    accountDetailsNode.payload &&
      typeof accountDetailsNode.payload.accountID === 'string',
    'Execting the payload of the account details node to have a valid account id',
  );
  return accountDetailsNode.payload.accountID;
}

export default connect()(Tabs);
