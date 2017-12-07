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

  _setTab = (tab: Tab): Promise<Tab> => {
    return new Promise(resolve => {
      this.setState({ currentTab: tab }, () => {
        resolve(this.state.currentTab);
      });
    });
  };
}

function mapReduxStateToProps(state: ReduxState) {
  const { navState } = state;
  // NOTE: We could be transition in or out of the tab controls. We should
  // prefer rendering the currently set controls, but if the current controls
  // don't have tabs, then we need to render the IN_PROGRESS controls.
  let tab: Tab;
  if (navState.transitionStatus === 'COMPLETE') {
    invariant(
      navState.controlsPayload.tab,
      'Cannot render Tabs.react on a complete transition without a tab',
    );
    tab = navState.controlsPayload.tab;
  } else if (navState.previousControlsPayload.tab) {
    tab = navState.previousControlsPayload.tab;
  } else {
    invariant(
      navState.incomingControlsPayload.tab,
      'Either previous controls or incoming controls must have tab for Tabs.react to render',
    );
    tab = navState.incomingControlsPayload.tab;
  }
  return { initialTab: tab };
}

export default connect(mapReduxStateToProps)(Tabs);
