/* @flow */

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
        return this._renderAuth();
      }
      case 'LOADING': {
        return this._renderLoading();
      }
      case 'MAIN': {
        return this._renderMain();
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

  _setMode = (mode: Mode): void => {
    this.setState({ currentMode: mode });
  };
}

function mapReduxStateToProps(state: ReduxState) {
  return { initialMode: state.navControls.mode };
}

export default connect(mapReduxStateToProps)(App);
