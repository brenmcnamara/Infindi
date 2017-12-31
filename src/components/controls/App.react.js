/* @flow */

import Colors from '../../design/colors';
import Environment from '../../modules/Environment';
import If from '../shared/If.react';
import LoadingScreen from '../LoadingScreen.react';
import LoginScreen from '../LoginScreen.react';
import ModalManager from '../ModalManager.react';
import NoInternetScreen from '../NoInternetScreen.react';
import React, { Component } from 'react';
import Tabs from './Tabs.react';

import invariant from 'invariant';

import { connect } from 'react-redux';
import { envDoneLoading, envFailedLoading } from '../../actions/config';
import { getRoot } from '../../common/route-utils';
import { getRoute } from '../../store/state-utils';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import type { ReduxProps } from '../../typesDEPRECATED/redux';
import type { RootType } from '../../common/route-utils';
import type { State as ReduxState } from '../../reducers/root';

export type Props = ReduxProps & {
  root: RootType,
};

class App extends Component<Props> {
  componentWillMount(): void {
    const { dispatch } = this.props;
    // TODO: For now we are doing this here, but may want to move this into
    // some middleware as the project gets more complex.
    Environment.genLazyLoad()
      .then(() => dispatch(envDoneLoading()))
      .catch(() => dispatch(envFailedLoading()));
  }

  render() {
    const { root } = this.props;
    let mainContent = null;
    switch (root) {
      case 'AUTH': {
        mainContent = <LoginScreen />;
        break;
      }

      case 'LOADING': {
        mainContent = <LoadingScreen />;
        break;
      }

      case 'MAIN': {
        mainContent = <Tabs />;
        break;
      }

      case 'NO_INTERNET': {
        mainContent = <NoInternetScreen />;
        break;
      }

      default:
        invariant(false, 'Unrecognized app root %s', root);
    }
    const bottomAreaStyles = [
      styles.bottomArea,
      {
        backgroundColor: root === 'MAIN' ? Colors.TAB_BAR : Colors.BACKGROUND,
      },
    ];
    // NOTE: The safe area view and keyboard avoiding view do not play well
    // together. Keyboard avoiding view should always be the parent of the
    // safe area view.
    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.main}>
            <If predicate={root === 'MAIN'}>
              <ModalManager />
            </If>
            {mainContent}
          </View>
          <View style={bottomAreaStyles} />
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }

  _renderAuth() {
    return null;
  }

  _renderLoading() {
    return null;
  }

  _renderMain() {
    return <Tabs />;
  }
}

const styles = StyleSheet.create({
  bottomArea: {
    bottom: 0,
    height: 40,
    left: 0,
    position: 'absolute',
    right: 0,
  },

  main: {
    flex: 1,
    zIndex: 1,
  },

  safeArea: {
    backgroundColor: Colors.BACKGROUND,
    flex: 1,
  },
});

function mapReduxStateToProps(state: ReduxState) {
  const route = getRoute(state);
  const root = getRoot(route);
  return { root };
}

export default connect(mapReduxStateToProps)(App);
