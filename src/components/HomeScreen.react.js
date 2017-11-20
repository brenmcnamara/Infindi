/* @flow */

import React, { Component } from 'react';
import Unimplemented from './Unimplemented.react';

import { connect } from 'react-redux';

import { type ReduxProps } from 'redux';

export type Props = ReduxProps;

class HomeScreen extends Component<Props> {
  render() {
    return <Unimplemented />;
  }
}

const mapReduxStateToProps = () => ({});

export default connect(mapReduxStateToProps)(HomeScreen);
