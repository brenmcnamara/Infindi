/* @flow */

import Colors from '../../design/colors';
import Environment from '../../modules/Environment';
import LoadingScreen from '../LoadingScreen.react';
import LoginScreen from '../LoginScreen.react';
import ModalManager from '../ModalManager.react';
import React, { Component } from 'react';
import Tabs from './Tabs.react';

import invariant from 'invariant';

import { connect } from 'react-redux';
import { envDoneLoading, envFailedLoading } from '../../actions/config';
import { setModeControls } from '../../actions/navigation';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import type { Mode } from '../../controls';
import type { ReduxProps } from '../../typesDEPRECATED/redux';
import type { State as ReduxState } from '../../reducers/root';

export type Props = ReduxProps & {
  initialMode: Mode,
};

type State = {
  currentMode: Mode,
};

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentMode: this.props.initialMode,
    };
  }

  componentWillMount(): void {
    const { dispatch } = this.props;
    // TODO: For now we are doing this here, but may want to move this into
    // some middleware as the project gets more complex.
    Environment.genLazyLoad()
      .then(() => dispatch(envDoneLoading()))
      .catch(() => dispatch(envFailedLoading()));
  }

  componentDidMount(): void {
    const { dispatch } = this.props;
    dispatch(
      setModeControls({
        setMode: this._setMode,
      }),
    );
  }

  render() {
    const { currentMode } = this.state;
    let mainContent = null;
    switch (currentMode) {
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

      default:
        invariant(false, 'Unrecognized app mode %s', this.state.currentMode);
    }
    const bottomAreaStyles = [
      styles.bottomArea,
      {
        backgroundColor:
          currentMode === 'MAIN' ? Colors.TAB_BAR : Colors.BACKGROUND,
      },
    ];
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.main}>
          <ModalManager />
          {mainContent}
        </View>
        <View style={bottomAreaStyles} />
      </SafeAreaView>
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

  _setMode = (mode: Mode): Promise<Mode> => {
    return new Promise(resolve => {
      this.setState({ currentMode: mode }, () => {
        resolve(this.state.currentMode);
      });
    });
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
  const { navState } = state;
  return {
    initialMode:
      navState.transitionStatus === 'COMPLETE'
        ? navState.controlsPayload.mode
        : navState.previousControlsPayload.mode,
  };
}

export default connect(mapReduxStateToProps)(App);
