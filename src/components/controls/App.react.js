/* @flow */

import LoadingScreen from '../LoadingScreen.react';
import LoginScreen from '../LoginScreen.react';
import React, { Component } from 'react';
import Tabs from './Tabs.react';

import invariant from 'invariant';

import { connect } from 'react-redux';
import { setModeControls } from '../../actions/navigation';

import type { Mode } from '../../controls';
import type { ReduxProps } from '../../types/redux';
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

  componentDidMount(): void {
    this.props.dispatch(
      setModeControls({
        setMode: this._setMode,
      }),
    );
  }

  render() {
    switch (this.state.currentMode) {
      case 'AUTH': {
        return <LoginScreen />;
      }
      case 'LOADING': {
        return <LoadingScreen />;
      }
      case 'MAIN': {
        return <Tabs />;
      }
    }
    invariant(false, 'Unrecognized app mode %s', this.state.currentMode);
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
