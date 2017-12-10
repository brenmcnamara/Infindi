/* @flow */

import Colors from '../../design/colors';
import Icons from '../../design/icons';
import React, { Component } from 'react';

import { NavigatorIOS } from 'react-native';

import { connect } from 'react-redux';

import type { ReduxProps } from '../../typesDEPRECATED/redux';

export type NavigatorPayload = {
  component: Object,
  couldBeScrollable?: bool,
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
    const { payload } = this.props;
    const Component = payload.component;
    return (
      <NavigatorIOS
        initialRoute={{
          barTintColor: Colors.BACKGROUND,
          component: Component,
          leftButtonIcon: Icons.List,
          shadowHidden: !payload.couldBeScrollable,
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
