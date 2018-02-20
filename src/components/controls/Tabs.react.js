/* @flow */

import AccountsScreen from '../AccountsScreen.react';
import Navigator from './Navigator.react';
import React, { Component } from 'react';

import invariant from 'invariant';

import { connect } from 'react-redux';
import { getRoute } from '../../common/state-utils';
import { getTab } from '../../common/route-utils';

import type { ReduxProps } from '../../typesDEPRECATED/redux';
import type { State as ReduxState } from '../../reducers/root';
import type { TabType } from '../../common/route-utils';

export type Props = ReduxProps & {
  tab: TabType,
};

export type TabControls = {
  setTab: (tab: TabType) => void,
};

class Tabs extends Component<Props> {
  render() {
    return (
      <Navigator
        payload={{ component: AccountsScreen, couldBeScrollable: true }}
      />
    );
  }
}

function mapReduxStateToProps(state: ReduxState) {
  const route = getRoute(state);
  const tab = getTab(route);
  invariant(
    tab && tab === 'ACCOUNTS',
    'Expecting tab to be set to ACCOUNTS in route',
  );
  return { tab };
}

export default connect(mapReduxStateToProps)(Tabs);
