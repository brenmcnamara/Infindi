/* @flow */

import React, { Component } from 'react';

import { ButtonIDs } from '../../constants';

import {
  type NavigatorEvent,
  type NavigatorProps,
} from '../../types/navigator';

export default function withNavigatorControls(Component: *) {
  return (props: *) => {
    const { navigator, ...rest } = props;
    return (
      <NavigatorControls
        component={Component}
        navigator={navigator}
        passThroughProps={rest}
      />
    );
  };
}

type Props = NavigatorProps & {
  component: *,
  passThroughProps: *,
};

class NavigatorControls extends Component<Props> {
  componentDidMount(): void {
    this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent);
  }

  render() {
    const Comp = this.props.component;
    return <Comp {...this.props.passThroughProps} />;
  }

  _onNavigatorEvent = (event: NavigatorEvent) => {
    if (
      event.type === 'NavBarButtonPress' &&
      event.id === ButtonIDs.SETTINGS_BUTTON
    ) {
      this.props.navigator.toggleDrawer({
        animated: true,
        side: 'left',
      });
    }
  };
}
