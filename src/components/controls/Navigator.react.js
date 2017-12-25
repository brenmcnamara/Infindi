/* @flow */

import Colors from '../../design/colors';
import Icons from '../../design/icons';
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { NavigatorIOS } from 'react-native';
import { requestLeftPane } from '../../actions/modal';

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
          onLeftButtonPress: this._onPressLeftButton,
          shadowHidden: !payload.couldBeScrollable,
          tintColor: Colors.NAV_BAR_BUTTON,
          title: '',
        }}
        style={{ flex: 1 }}
      />
    );
  }

  _onPressLeftButton = (): void => {
    this.props.dispatch(requestLeftPane());
  };
}

function mapReduxStateToProps() {
  return {};
}

export default connect(mapReduxStateToProps)(Navigator);
