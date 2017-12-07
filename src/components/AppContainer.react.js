/* @flow */

import App from './controls/App.react';
import React, { Component } from 'react';
import Store from '../store';

import { Provider } from 'react-redux';

export default class AppContainer extends Component<{}> {
  render() {
    return (
      <Provider store={Store}>
        <App />
      </Provider>
    );
  }
}
