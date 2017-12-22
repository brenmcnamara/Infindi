/* @flow */

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
import { View } from 'react-native';

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
    let mainContent = null;
    switch (this.state.currentMode) {
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

    return (
      <View style={{ flex: 1 }}>
        <ModalManager />
        {mainContent}
      </View>
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
