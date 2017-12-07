/* @flow */

import React, { Component } from 'react';

import { NavigatorIOS } from 'react-native';

import { connect } from 'react-redux';

export type NavigatorPayload = {
  component: Object,
};

export type Props = {
  payload: NavigatorPayload,
};

/**
 * The navigator component, used to render the navigation bar, show the correct
 * global navigation buttons, and handle navigation transitions.
 */
class Navigator extends Component<Props> {
  render() {
    const Component = this.props.payload.component;
    return (
      <NavigatorIOS
        initialRoute={{
          component: Component,
          title: '',
        }}
        style={{ flex: 1 }}
      />
    );
  }
}

function mapReduxStateToProps() {
  return {};
}

export default connect(mapReduxStateToProps)(Navigator);
