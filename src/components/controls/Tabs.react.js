/* @flow */

import AccountsScreen from '../AccountsScreen.react';
import HomeScreen from '../HomeScreen.react';
import Icons from '../../design/icons';
import Navigator from './Navigator.react';
import React, { Component } from 'react';

import invariant from 'invariant';

import { connect } from 'react-redux';
import {
  navigateToAccounts,
  navigateToHome,
  setTabControls,
} from '../../actions/navigation';
import { TabBarIOS } from 'react-native';

import type { ReduxProps } from '../../types/redux';
import type { State as ReduxState } from '../../reducers/root';
import type { Tab } from '../../controls';

export type Props = ReduxProps & {
  initialTab: Tab,
};

export type TabControls = {
  setTab: (tab: Tab) => void,
};

type State = {
  currentTab: Tab,
};

class Tabs extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentTab: props.initialTab,
    };
  }

  componentDidMount(): void {
    this.props.dispatch(
      setTabControls({
        setTab: this._setTab,
      }),
    );
  }

  render() {
    return (
      <TabBarIOS>
        <TabBarIOS.Item
          icon={Icons.Home}
          onPress={() => {
            if (this.state.currentTab !== 'HOME') {
              this.props.dispatch(navigateToHome());
            }
          }}
          selected={this.state.currentTab === 'HOME'}
          title="Home"
        >
          <Navigator payload={{ component: HomeScreen }} />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={Icons.Bank}
          onPress={() => {
            if (this.state.currentTab !== 'ACCOUNTS') {
              this.props.dispatch(navigateToAccounts());
            }
          }}
          selected={this.state.currentTab === 'ACCOUNTS'}
          title="Accounts"
        >
          <Navigator payload={{ component: AccountsScreen }} />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }

  _setTab = (tab: Tab): void => {
    this.setState({ currentTab: tab });
  };
}

function mapReduxStateToProps(state: ReduxState) {
  const tab = state.navControls.tab;
  invariant(tab, 'Tab control is empty when trying to render Tabs compnent');
  return { initialTab: tab };
}

export default connect(mapReduxStateToProps)(Tabs);
