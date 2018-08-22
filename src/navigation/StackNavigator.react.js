/* @flow */

import * as React from 'react';
import Icons from '../design/icons';

import invariant from 'invariant';
import throttle from '../shared/throttle';

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

export type NavButton = {|
  +icon: *,
  +onPress: () => void,
|};

export type Props = ThemeProps & ReduxProps & ComponentProps & ComputedProps;

type ComponentProps = {
  calculateBackAction: (prevScreen: string, currentScreen: string) => Action,
  calculateStackForState: (
    state: ReduxState,
    currentStack: ScreenStack | null,
  ) => ScreenStack,
  getLeftNavButton?: (currentScreen: string) => NavButton | null,
  getRightNavButton?: (currentScreen: string) => NavButton | null,
  isBarShadowShowing?: boolean,
  screens: Array<ScreenPayload>,
};

type ComputedProps = {
  reduxState: ReduxState,
};

type ScreenStack = Array<string>;

type State = {
  screenStack: ScreenStack,
};

class StackNavigator extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const screenStack = props.calculateStackForState(props.reduxState, null);
    invariant(
      screenStack.length === 1,
      'StackNavigator must be initialized with a screen stack of size 1: [%s]',
      screenStack.join(', '),
    );
    this.state = { screenStack };
  }

  static getDerivedStateFromProps(props: Props, state: ?State): State {
    return {
      screenStack: props.calculateStackForState(
        props.reduxState,
        state ? state.screenStack : null,
      ),
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State): void {
    const prevStack = prevState.screenStack;
    const currentStack = this.state.screenStack;

    invariant(
      currentStack.length > 0,
      'Screen stack must contain at least 1 screen',
    );

    invariant(
      currentStack.length - prevStack.length <= 1,
      'Stack Navigator cannot push more than one item at a time',
    );

    if (currentStack.length > prevStack.length) {
      // Pushed an item.
      const screen = currentStack[currentStack.length - 1];
      const component = this._getComponent(screen);
      const rightNavButton = this.props.getRightNavButton
        ? this.props.getRightNavButton(screen)
        : null;

      this.refs.nav.push({
        barTintColor: this.props.theme.color.backgroundMain,
        component,
        leftButtonIcon: Icons.LeftArrow,
        onLeftButtonPress: this._onBack,
        onRightButtonPress: rightNavButton && rightNavButton.onPress,
        rightButtonIcon: rightNavButton && rightNavButton.icon,
        shadowHidden: !this.props.isBarShadowShowing,
        tintColor: this.props.theme.color.buttonNavBar,
        title: '',
      });
      return;
    }

    // NOTE: From this point on, the current stack is shorter than or equal to
    // in length than the previous stack.

    // Validate that the previous stack is a sub-list of the current stack.
    invariant(
      currentStack.every((screen, index) => screen === prevStack[index]),
      'Stack Navigator only supports push and pop',
    );

    if (prevStack.length === currentStack.length) {
      return;
    }

    this.refs.nav.popN(prevStack.length - currentStack.length);
  }

  render() {
    const { getLeftNavButton, getRightNavButton } = this.props;
    const currentScreen = this._getCurrentScreen();
    const leftNavButton = getLeftNavButton
      ? getLeftNavButton(currentScreen)
      : null;
    const rightNavButton = getRightNavButton
      ? getRightNavButton(currentScreen)
      : null;

    return (
      <NavigatorIOS
        initialRoute={{
          barTintColor: this.props.theme.color.backgroundMain,
          component: this._getInitialComponent(),
          leftButtonIcon: leftNavButton && leftNavButton.icon,
          onLeftButtonPress: leftNavButton && leftNavButton.onPress,
          onRightButtonPress: rightNavButton && rightNavButton.onPress,
          rightButtonIcon: rightNavButton && rightNavButton.icon,
          shadowHidden: !this.props.isBarShadowShowing,
          tintColor: this.props.theme.color.buttonNavBar,
          title: '',
        }}
        key={this.props.theme.uniqueID}
        ref="nav"
        style={{ flex: 1 }}
      />
    );
  }

  // TODO: Memoize
  _getInitialComponent() {
    return this._getComponent(this.state.screenStack[0]);
  }

  _getComponent(screen: string) {
    const { screens } = this.props;
    const payload = screens.find(payload => payload.screen === screen);
    invariant(payload, 'No screen could be found with name %s', screen);
    return payload.component;
  }

  _getCurrentScreen(): string {
    const { screenStack } = this.state;
    invariant(
      screenStack.length >= 1,
      'Screen Stack needs to have at least 1 screen',
    );
    return screenStack[screenStack.length - 1];
  }

  _onBack = throttle(500, (): void => {
    const { calculateBackAction, dispatch } = this.props;
    const { screenStack } = this.state;
    invariant(
      screenStack.length >= 2,
      'Cannot pop item from stack with less than 2 elements',
    );
    const currentScreen = screenStack[screenStack.length - 1];
    const prevScreen = screenStack[screenStack.length - 2];
    dispatch(calculateBackAction(prevScreen, currentScreen));
  });
}

function mapReduxStateToProps(reduxState: ReduxState): ComputedProps {
  return { reduxState };
}

export default connect(mapReduxStateToProps)(GetThemeHOC(StackNavigator));
