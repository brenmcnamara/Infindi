/* @flow */

import * as React from 'react';
import Icons from '../design/icons';

import invariant from 'invariant';

import { connect } from 'react-redux';
import { GetThemeHOC } from '../design/components/Theme.react';
import { NavigatorIOS } from 'react-native';

import type { Action, ReduxProps, ReduxState } from '../store';
import type { ScreenPayload } from './types';
import type { ThemeProps } from '../design/components/Theme.react';

export type ComponentPayload = {
  component: React.ComponentType<*>,
  isBackEnabled?: () => boolean,
};
export type Props = ThemeProps & ReduxProps & ComponentProps & ComputedProps;

type ComponentProps = {
  calculateBackAction: (prevScreen: string, currentScreen: string) => Action,
  calculateStackForState: (state: ReduxState) => ScreenStack,
  isBarShadowShowing?: boolean,
  screens: Array<ScreenPayload>,
};
type ComputedProps = {
  screenStack: ScreenStack,
};
type ScreenStack = Array<string>;

class StackNavigator extends React.Component<Props> {
  componentDidUpdate(prevProps: Props): void {
    const prevStack = prevProps.screenStack;
    const currentStack = this.props.screenStack;

    invariant(
      currentStack.length > 0,
      'Screen stack must contain at least 1 screen',
    );

    invariant(
      Math.abs(prevStack.length - currentStack.length) <= 1,
      'Stack Navigator only supports pushing and popping a single item',
    );

    if (prevStack.length === currentStack.length) {
      // Validate they look the same, for now only allow single push and
      // single pop.
      invariant(
        prevStack.every((screen, index) => screen === currentStack[index]),
        'Stack Navigator only supports push and pop',
      );
      return;
    }

    if (prevStack.length > currentStack.length) {
      // Popped an item.
      this.refs.nav.pop();
    } else if (currentStack.length > prevStack.length) {
      // Pushed an item.
      const screen = currentStack[currentStack.length - 1];
      const component = this._getComponent(screen);
      this.refs.nav.push({
        barTintColor: this.props.theme.color.backgroundMain,
        component,
        leftButtonIcon: Icons.LeftArrow,
        onLeftButtonPress: this._onBack,
        shadowHidden: !this.props.isBarShadowShowing,
        tintColor: this.props.theme.color.buttonNavBar,
        title: '',
      });
    }
  }

  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          barTintColor: this.props.theme.color.backgroundMain,
          component: this._getInitialComponent(),
          shadowHidden: !this.props.isBarShadowShowing,
          tintColor: this.props.theme.color.buttonNavBar,
          title: '',
        }}
        ref="nav"
        style={{ flex: 1 }}
      />
    );
  }

  // TODO: Memoize
  _getInitialComponent() {
    return this._getComponent(this.props.screenStack[0]);
  }

  _getComponent(screen: string) {
    const { screens } = this.props;
    const payload = screens.find(payload => payload.screen === screen);
    invariant(payload, 'No screen could be found with name %s', screen);
    return payload.component;
  }

  _onBack = (): void => {
    const { calculateBackAction, dispatch, screenStack } = this.props;
    invariant(
      screenStack.length >= 2,
      'Cannot pop item from stack with less than 2 elements',
    );
    const currentScreen = screenStack[screenStack.length - 1];
    const prevScreen = screenStack[screenStack.length - 2];
    dispatch(calculateBackAction(prevScreen, currentScreen));
  };
}

function mapReduxStateToProps(
  state: ReduxState,
  props: ComponentProps,
): ComputedProps {
  return {
    screenStack: props.calculateStackForState(state),
  };
}

export default connect(mapReduxStateToProps)(GetThemeHOC(StackNavigator));