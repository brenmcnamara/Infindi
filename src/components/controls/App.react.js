/* @flow */

import AuthNavigator from './AuthNavigator.react';
import LoadingScreen from '../../core/LoadingScreen.react';
import ModalManager from '../ModalManager.react';
import NoInternetScreen from '../NoInternetScreen.react';
import ProviderLoginScreen from '../../link/components/ProviderLoginScreen.react';
import ProviderSearchScreen from '../../link/components/ProviderSearchScreen.react';
import React, { Component } from 'react';
import RecommendationScreen from '../RecommendationScreen.react';
import Tabs from './Tabs.react';
import ThemeProvider, { GetTheme } from '../../design/components/Theme.react';
import WatchSessionStateUtils from '../../watch-session/state-utils';

import invariant from 'invariant';

import { connect } from 'react-redux';
import { createRoute, forceGetNextNode } from '../../common/route-utils';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import type { ReduxProps } from '../../store';
import type { RouteNode } from '../../common/route-utils';
import type { State as ReduxState } from '../../reducers/root';
import type { Theme } from '../../design/themes';

export type Props = ReduxProps & ComputedProps;

type ComputedProps = {
  isInWatchSession: boolean,
  root: RouteNode,
};

class App extends Component<Props> {
  _safeAreaSubviewLayout: *;

  render() {
    const { isInWatchSession, root } = this.props;
    let mainContent = null;
    switch (root.name) {
      case 'AUTH': {
        mainContent = (
          <GetTheme>
            {(theme: Theme) => <AuthNavigator routeNode={root} theme={theme} />}
          </GetTheme>
        );
        break;
      }

      case 'LOADING': {
        mainContent = <LoadingScreen />;
        break;
      }

      case 'MAIN': {
        mainContent = (
          <GetTheme>
            {theme => <Tabs routeNode={forceGetNextNode(root)} theme={theme} />}
          </GetTheme>
        );
        break;
      }

      case 'NO_INTERNET': {
        mainContent = <NoInternetScreen />;
        break;
      }

      case 'PROVIDER_LOGIN': {
        mainContent = <ProviderLoginScreen enableInteraction={true} />;
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
    // NOTE: The safe area view and keyboard avoiding view do not play well
    // together. Keyboard avoiding view should always be the parent of the
    // safe area view.
    return (
      <ThemeProvider themeName={isInWatchSession ? 'lightInverted' : 'light'}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <GetTheme>
            {theme => (
              <SafeAreaView
                style={[
                  styles.safeArea,
                  {
                    backgroundColor: theme.color.backgroundMain,
                  },
                ]}
              >
                <View style={styles.main}>
                  {this.props.root.name === 'MAIN' ||
                  this.props.root.name === 'PROVIDER_SEARCH' ||
                  this.props.root.name === 'PROVIDER_LOGIN' ? (
                    <ModalManager />
                  ) : null}
                  {mainContent}
                </View>
                <View
                  style={[
                    styles.bottomArea,
                    { backgroundColor: theme.color.backgroundMain },
                  ]}
                />
              </SafeAreaView>
            )}
          </GetTheme>
        </KeyboardAvoidingView>
      </ThemeProvider>
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
    flex: 1,
  },
});

function mapReduxStateToProps(state: ReduxState) {
  return {
    isInWatchSession: WatchSessionStateUtils.getIsInWatchSession(state),
    root: createRoute(state),
  };
}

export default connect(mapReduxStateToProps)(App);
