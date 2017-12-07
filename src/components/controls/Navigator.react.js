/* @flow */

import Colors from '../../design/colors';
import Icons from '../../design/icons';
import React, { Component } from 'react';

import { NavigatorIOS } from 'react-native';

import { connect } from 'react-redux';

import type { ReduxProps } from '../../types/redux';

export type NavigatorPayload = {
  component: Object,
};

export type Props = ReduxProps & {
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
          barTintColor: Colors.BACKGROUND,
          component: Component,
          leftButtonIcon: Icons.List,
          shadowHidden: true,
          tintColor: Colors.NAV_BAR_BUTTON,
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
