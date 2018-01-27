/* @flow */

import PROVIDERS_TEMP from './TEMP';

import AccountLogin from './AccountLogin.react';
import Colors from '../design/colors';
import Content from '../components/shared/Content.react';
import FooterWithButtons from '../components/shared/FooterWithButtons.react';
import ProviderSearch from './ProviderSearch.react';
import React, { Component } from 'react';
import Screen from '../components/shared/Screen.react';

import invariant from 'invariant';

import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { dismissAccountVerification } from './action';

import type { ComponentType } from 'react';
import type { Provider as YodleeProvider } from 'common/lib/models/YodleeProvider';
import type { ReduxProps } from '../typesDEPRECATED/redux';
import type { TransitionStage } from '../reducers/modalState';

export type ComponentProps = {
  transitionStage: TransitionStage,
};

export type ReduxStateProps = {};

export type Props = ReduxProps & ReduxStateProps & ComponentProps;

type Page =
  | {|
      +providers: Array<YodleeProvider>,
      +search: string,
      +type: 'SEARCH',
    |}
  | {|
      +provider: YodleeProvider,
      +search: string,
      +type: 'LOGIN',
    |};

type State = {
  page: Page,
};

// TODO: BUG: Click on Add Account / Cancel many times really fast to get
// modal view to throw an error.
export const TransitionInMillis = 400;
export const TransitionOutMillis = 400;

class AccountVerification extends Component<Props, State> {
  state: State = {
    page: { providers: PROVIDERS_TEMP, search: '', type: 'SEARCH' },
  };

  _transitionValue: Animated.Value;

  constructor(props: Props) {
    super(props);
    this._transitionValue = new Animated.Value(props.show ? 1.0 : 0.0);
  }

  componentWillReceiveProps(nextProps: Props): void {
    const didTransition =
      this.props.transitionStage === 'TRANSITION_IN' ||
      this.props.transitionStage === 'TRANSITION_OUT';
    const willTransition =
      nextProps.transitionStage === 'TRANSITION_IN' ||
      nextProps.transitionStage === 'TRANSITION_OUT';
    if (didTransition || !willTransition) {
      return;
    }
    Animated.timing(this._transitionValue, {
      duration: nextProps.show ? TransitionInMillis : TransitionOutMillis,
      easing: Easing.out(Easing.cubic),
      toValue: nextProps.transitionStage === 'TRANSITION_IN' ? 1.0 : 0.0,
    }).start();
  }

  render() {
    const rootStyles = [
      styles.root,
      {
        opacity: this._transitionValue,
      },
    ];
    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <Animated.View style={rootStyles}>
          <SafeAreaView style={styles.safeArea}>
            <Screen>
              <Content>{this._renderContent()}</Content>
              <FooterWithButtons
                buttonLayout={this._getFooterButtonLayout()}
                onPress={this._onFooterButtonPress}
              />
            </Screen>
          </SafeAreaView>
        </Animated.View>
      </KeyboardAvoidingView>
    );
  }

  _renderContent() {
    const { page } = this.state;
    switch (page.type) {
      case 'SEARCH': {
        return (
          <ProviderSearch
            isEditable={this.props.transitionStage === 'IN'}
            search={page.search}
            onChangeSearch={this._onChangeSearch}
            onSelectProvider={this._onSelectProvider}
            providers={page.providers}
          />
        );
      }

      case 'LOGIN': {
        return <AccountLogin onBack={this._onBack} provider={page.provider} />;
      }

      default:
        return invariant(false, 'Unhandled page: %s', page.type);
    }
  }

  _onFooterButtonPress = (button: 'LEFT' | 'RIGHT' | 'CENTER'): void => {
    if (this._isCancelButton(button)) {
      this.props.dispatch(dismissAccountVerification());
    }
  };

  _onChangeSearch = (search: string): void => {
    const { page } = this.state;
    invariant(
      page.type === 'SEARCH',
      'Expecting page to be SEARCH when changing search',
    );
    this.setState({
      page: { providers: PROVIDERS_TEMP, search, type: 'SEARCH' },
    });
  };

  _onSelectProvider = (provider: YodleeProvider): void => {
    const { page } = this.state;
    invariant(
      page.type === 'SEARCH',
      'Expecting page to be SEARCH when provider is selected',
    );
    this.setState({
      page: { provider, search: page.search, type: 'LOGIN' },
    });
  };

  _onBack = (): void => {
    const { page } = this.state;
    invariant(
      page.type === 'LOGIN',
      'Expecting page to be LOGIN when back button is pressed',
    );
    this.setState({
      page: { providers: PROVIDERS_TEMP, search: page.search, type: 'SEARCH' },
    });
  };

  _getFooterButtonLayout() {
    return this.state.page.type === 'SEARCH'
      ? {
          centerButtonText: 'CANCEL',
          type: 'CENTER',
        }
      : {
          leftButtonText: 'CANCEL',
          rightButtonText: 'LOGIN',
          type: 'LEFT_AND_RIGHT',
        };
  }

  _isCancelButton(button: 'LEFT' | 'RIGHT' | 'CENTER') {
    return button === 'CENTER' || button === 'LEFT';
  }
}

export default (connect()(AccountVerification): ComponentType<ComponentProps>);

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.BACKGROUND,
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },
});
