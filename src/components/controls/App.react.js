/* @flow */

import Colors from '../../design/colors';
import Environment from '../../modules/Environment';
import LoadingScreen from '../LoadingScreen.react';
import LoginScreen from '../LoginScreen.react';
import ModalManager from '../ModalManager.react';
import NoInternetScreen from '../NoInternetScreen.react';
import React, { Component } from 'react';
import RecommendationScreen from '../RecommendationScreen.react';
import Tabs from './Tabs.react';

import invariant from 'invariant';

import { connect } from 'react-redux';
import {
  appInsetChange,
  envDoneLoading,
  envFailedLoading,
} from '../../actions/config';
import { getRoot } from '../../common/route-utils';
import { getRoute } from '../../store/state-utils';
import {
  Dimensions,
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
          <View style={styles.main} onLayout={this._onLayoutSafeAreaSubview}>
            <ModalManager />
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

  // TODO: Proper typing.
  // TODO: Make sure this is accurate when the keyboard is showing / hiding.
  _onLayoutSafeAreaSubview = (event: *): void => {
    const { layout } = event.nativeEvent;
    this.props.dispatch(
      appInsetChange({
        bottom: SCREEN_HEIGHT - layout.y - layout.height,
        left: layout.x,
        right: SCREEN_WIDTH - layout.x - layout.width,
        top: layout.y,
      }),
    );
  };
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
