/* @flow */

import React, { Component } from 'react';
import Unimplemented from './Unimplemented.react';

import { connect } from 'react-redux';

class HomeScreen extends Component<{}> {
  static navigatorStyle = {};

  render() {
    return <Unimplemented />;
  }
}

const mapReduxStateToProps = () => ({});

export default connect(mapReduxStateToProps)(HomeScreen);
