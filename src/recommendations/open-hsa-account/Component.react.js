/* @flow */

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

class OpenHSAAccount extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      navStack: [
        {
          component: InitialScreen,
          navigationBarHidden: true,
          passProps: {
            onContribute: this._onContribute,
            onLearnMoreAboutHSAs: this._onLearnMoreAboutHSAs,
            onNoThanks: this.props.onNoThanks,
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
    return (
      <View style={styles.root}>
        <Header
          canNavigateBack={navStack.length > 1}
          onPressBack={this._onPressBack}
          title={Template.title}
        />
        <NavigatorIOS initialRoute={navStack[0]} ref="nav" style={styles.nav} />
      </View>
    );
  }

  _onContribute = (): void => {};

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
