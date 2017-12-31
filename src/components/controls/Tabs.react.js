/* @flow */

import AccountsScreen from '../AccountsScreen.react';
import HomeScreen from '../HomeScreen.react';
import Icons from '../../design/icons';
import Navigator from './Navigator.react';
import React, { Component } from 'react';

import invariant from 'invariant';

import { connect } from 'react-redux';
import { getRoute } from '../../store/state-utils';
import { getTab } from '../../common/route-utils';
import { requestTab } from '../../actions/router';
import { TabBarIOS } from 'react-native';

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
    const { tab } = this.props;
    return (
      <TabBarIOS>
        <TabBarIOS.Item
          icon={Icons.Home}
          onPress={() => {
            if (tab !== 'HOME') {
              this.props.dispatch(requestTab('HOME'));
            }
          }}
          selected={tab === 'HOME'}
          title="Home"
        >
          <Navigator payload={{ component: HomeScreen }} />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={Icons.Bank}
          onPress={() => {
            if (tab !== 'ACCOUNTS') {
              this.props.dispatch(requestTab('ACCOUNTS'));
            }
          }}
          selected={tab === 'ACCOUNTS'}
          title="Accounts"
        >
          <Navigator
            payload={{ component: AccountsScreen, couldBeScrollable: true }}
          />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}

function mapReduxStateToProps(state: ReduxState) {
  const route = getRoute(state);
  const tab = getTab(route);
  invariant(tab, 'Expecting tab to be set in route');
  return { tab };
}

export default connect(mapReduxStateToProps)(Tabs);
