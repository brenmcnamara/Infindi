/* @flow */

import Colors from '../design/colors';
import React, { Component } from 'react';
import Unimplemented from './Unimplemented.react';

export default class HomeScreen extends Component<{}> {
  static navigatorStyle = {
    navBarBackgroundColor: Colors.BACKGROUND_COLOR,
    navBarNoBorder: true,
  };

  render() {
    return <Unimplemented />;
  }
}
