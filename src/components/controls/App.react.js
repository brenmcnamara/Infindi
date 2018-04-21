/* @flow */

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
import Theme, { GetTheme } from '../../design/components/Theme.react';

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

import type { ReduxProps } from '../../store';
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
      <Theme themeName="light">
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
      </Theme>
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
  return { root: createRoute(state) };
}

export default connect(mapReduxStateToProps)(App);
