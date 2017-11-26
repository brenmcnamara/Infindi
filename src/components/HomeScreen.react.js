/* @flow */

import Content from './shared/Content.react';
import React, { Component } from 'react';
import Screen from './shared/Screen.react';
import Unimplemented from './Unimplemented.react';

import { connect } from 'react-redux';

import { type ReduxProps } from 'redux';

export type Props = ReduxProps;

class HomeScreen extends Component<Props> {
  render() {
    return (
      <Screen>
        <Content>
          <Unimplemented />
        </Content>
      </Screen>
    );
  }
}

const mapReduxStateToProps = () => ({});

export default connect(mapReduxStateToProps)(HomeScreen);
