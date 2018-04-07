/* @flow */

import Colors from '../../design/colors';
import Environment from '../../modules/Environment';
import LoadingScreen from '../LoadingScreen.react';
import LoginScreen from '../LoginScreen.react';
import ModalManager from '../ModalManager.react';
import NoInternetScreen from '../NoInternetScreen.react';
import ProviderLoginScreen from '../../link/components/ProviderLoginScreen.react';
import ProviderSearchScreen from '../../link/components/ProviderSearchScreen.react';
import React, { Component } from 'react';
import RecommendationScreen from '../RecommendationScreen.react';
import Tabs from './Tabs.react';

import invariant from 'invariant';

import { connect } from 'react-redux';
import { createRoute, forceGetNextNode } from '../../common/route-utils';
import { envDoneLoading, envFailedLoading } from '../../actions/config';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import type { ReduxProps } from '../../typesDEPRECATED/redux';
import type { RouteNode } from '../../common/route-utils';
import type { State as ReduxState } from '../../reducers/root';

export type Props = ReduxProps & {
  root: RouteNode,
};

class App extends Component<Props> {
  _safeAreaSubviewLayout: *;

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
    switch (root.name) {
      case 'AUTH': {
        mainContent = <LoginScreen />;
        break;
      }

      case 'LOADING': {
        mainContent = <LoadingScreen />;
        break;
      }

      case 'MAIN': {
        mainContent = <Tabs routeNode={forceGetNextNode(root)} />;
        break;
      }

      case 'NO_INTERNET': {
        mainContent = <NoInternetScreen />;
        break;
      }

      case 'PROVIDER_LOGIN': {
        mainContent = <ProviderLoginScreen />;
        break;
      }

      case 'PROVIDER_SEARCH': {
        mainContent = <ProviderSearchScreen />;
        break;
      }

      case 'RECOMMENDATION': {
        mainContent = <RecommendationScreen />;
        break;
      }

      default:
        invariant(false, 'Unrecognized app root %s', root);
    }
    const bottomAreaStyles = [
      styles.bottomArea,
      {
        // NOTE: Need to add this back when we add the tab bar back.
        // backgroundColor: root === 'MAIN' ? Colors.TAB_BAR : Colors.BACKGROUND,
        backgroundColor: Colors.BACKGROUND,
      },
    ];
    // NOTE: The safe area view and keyboard avoiding view do not play well
    // together. Keyboard avoiding view should always be the parent of the
    // safe area view.
    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.main}>
            {this.props.root.name === 'MAIN' ||
            this.props.root.name === 'PROVIDER_SEARCH' ||
            this.props.root.name === 'PROVIDER_LOGIN' ? (
              <ModalManager />
            ) : null}
            {mainContent}
          </View>
          <View style={bottomAreaStyles} />
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
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
  return { root: createRoute(state) };
}

export default connect(mapReduxStateToProps)(App);
