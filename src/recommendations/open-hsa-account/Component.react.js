/* @flow */

import ContributeScreen from './ContributeScreen.react';
import Footer from '../Footer.react';
import Header from '../Header.react';
import InitialScreen from './InitialScreen.react';
import LearnMoreAboutHSAsScreen from './LearnMoreAboutHSAsScreen.react';
import React, { Component } from 'react';

import invariant from 'invariant';

import { NavigatorIOS, StyleSheet, View } from 'react-native';
import { Template } from './Metadata';

import type { RecommendationComponentProps } from '..';

type State = {
  navStack: Array<*>,
};

export type Props = RecommendationComponentProps;

// TODO: Clicking on the back button twice quickly will break navigation. Need
// to fix this. May want to set some instance variable to indicate animation
// is happenning.
class OpenHSAAccount extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      navStack: [
        {
          component: InitialScreen,
          navigationBarHidden: true,
          passProps: {
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

  render() {
    const { navStack } = this.state;
    const top = navStack[navStack.length - 1];
    return (
      <View style={styles.root}>
        <Header
          canNavigateBack={navStack.length > 1}
          onPressBack={this._onPressBack}
          title={Template.title}
        />
        <NavigatorIOS initialRoute={navStack[0]} ref="nav" style={styles.nav} />
        <Footer
          callToActionText="CONTRIBUTE"
          onCallToAction={this._onContribute}
          onDismiss={this.props.onNoThanks}
          shouldShowCallToAction={top.component !== ContributeScreen}
        />
      </View>
    );
  }

  _onContribute = (): void => {
    const navStack = this.state.navStack.slice();
    navStack.push({
      component: ContributeScreen,
      navigationBarHidden: true,
    });
    this.setState({ navStack });
  };

  _onLearnMoreAboutHSAs = (): void => {
    const navStack = this.state.navStack.slice();
    navStack.push({
      component: LearnMoreAboutHSAsScreen,
      navigationBarHidden: true,
    });

    this.setState({ navStack });
  };

  _onPressBack = (): void => {
    const navStack = this.state.navStack.slice();
    navStack.pop();
    this.setState({ navStack });
  };
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
