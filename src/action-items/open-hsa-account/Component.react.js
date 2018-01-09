/* @flow */

import ContributeScreen from './ContributeScreen.react';
import Footer from '../Footer.react';
import Header from '../Header.react';
import InitialScreen from './InitialScreen.react';
import LearnAboutHPHPDs from './LearnAboutHPHPDs.react';
import LearnMoreAboutHSAsScreen from './LearnMoreAboutHSAsScreen.react';
import React, { Component } from 'react';

import invariant from 'invariant';

import { CallToActionText, Template } from './Metadata';
import { NavigatorIOS, StyleSheet, View } from 'react-native';

import type { ActionItemComponentProps } from '..';

type State = {
  navStack: Array<*>,
};

export type Props = ActionItemComponentProps;

// NOTE: This is a guess, need to keep this updated. If there is a way to
// programatically get this value, that would be much better :)
const NAVIGATOR_TRANSITION_MILLIS = 500;

class OpenHSAAccount extends Component<Props, State> {
  _navigatorTransitionTimeout: number | null = null;
  _isNavigatorTransitioning: bool = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      navStack: [
        {
          component: InitialScreen,
          navigationBarHidden: true,
          passProps: {
            onLearnAboutHDHPs: this._onLearnAboutHPHPDs,
            onLearnMoreAboutHSAs: this._onLearnMoreAboutHSAs,
          },
          title: Template.title,
        },
      ],
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State): void {
    if (this.state.navStack === prevState.navStack) {
      return;
    }

    invariant(
      this.state.navStack.length > 0,
      'Cannot have a navigation stack of 0',
    );

    const currentStack = this.state.navStack;
    const stackDiffCount = currentStack.length - prevState.navStack.length;

    switch (stackDiffCount) {
      case 1: {
        // Pushed something onto the stack.
        this.refs.nav.push(currentStack[currentStack.length - 1]);
        break;
      }

      case -1: {
        // Popped something off of the stack.
        this.refs.nav.pop();
        break;
      }

      default:
        invariant(
          false,
          'Navigation stack changed by unexpected amount: %s',
          stackDiffCount,
        );
    }
  }

  componentWillUnmount(): void {
    clearTimeout(this._navigatorTransitionTimeout);
    this._navigatorTransitionTimeout = null;
  }

  render() {
    const { navStack } = this.state;
    const top = navStack[navStack.length - 1];
    return (
      <View style={styles.root}>
        <Header
          canNavigateBack={navStack.length > 1}
          onPressBack={this._onPressBack}
          showHairline={
            top.component === LearnMoreAboutHSAsScreen ||
            top.component === LearnAboutHPHPDs
          }
          title={Template.title}
        />
        <NavigatorIOS initialRoute={navStack[0]} ref="nav" style={styles.nav} />
        <Footer
          callToActionText={CallToActionText}
          onCallToAction={this._onContribute}
          onDismiss={this.props.onNoThanks}
          shouldShowCallToAction={top.component !== ContributeScreen}
        />
      </View>
    );
  }

  _onContribute = (): void => {
    this._requestPush({
      component: ContributeScreen,
      navigationBarHidden: true,
    });
  };

  _onLearnAboutHPHPDs = (): void => {
    this._requestPush({
      component: LearnAboutHPHPDs,
      navigationBarHidden: true,
    });
  };

  _onLearnMoreAboutHSAs = (): void => {
    this._requestPush({
      component: LearnMoreAboutHSAsScreen,
      navigationBarHidden: true,
    });
  };

  _onPressBack = (): void => {
    this._requestPop();
  };

  // ---------------------------------------------------------------------------
  //
  // NAVIGATION UTILS
  //
  // ---------------------------------------------------------------------------

  _requestPush(payload: *): bool {
    if (this._isNavigatorTransitioning) {
      return false;
    }
    this._startNavigatorTransition();
    const navStack = this.state.navStack.slice();
    navStack.push(payload);
    this.setState({ navStack });
    return true;
  }

  _requestPop(): bool {
    if (this._isNavigatorTransitioning) {
      return false;
    }
    this._startNavigatorTransition();
    const navStack = this.state.navStack.slice();
    navStack.pop();
    this.setState({ navStack });
    return true;
  }

  // NOTE: The purpose of this is to avoid a bug where a double click on a
  // navigation back button resulting in the state to go back twice but the
  // ios navigator to only go back once.
  _startNavigatorTransition(): void {
    clearTimeout(this._navigatorTransitionTimeout);
    this._isNavigatorTransitioning = true;
    this._navigatorTransitionTimeout = setTimeout(() => {
      this._isNavigatorTransitioning = false;
    }, NAVIGATOR_TRANSITION_MILLIS);
  }
}

export default OpenHSAAccount;

const styles = StyleSheet.create({
  nav: {
    flex: 1,
  },

  root: {
    flex: 1,
  },
});
