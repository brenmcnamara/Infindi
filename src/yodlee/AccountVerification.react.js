/* @flow */

import Colors from '../design/colors';
import Content from '../components/shared/Content.react';
import FooterWithButtons from '../components/shared/FooterWithButtons.react';
import React, { Component } from 'react';
import Screen from '../components/shared/Screen.react';

import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { dismissAccountVerification } from './action';
import { NavBarHeight } from '../design/layout';

import type { ComponentType } from 'react';
import type { ReduxProps } from '../typesDEPRECATED/redux';

export type ComponentProps = {
  show: bool,
};

export type ReduxStateProps = {};

export type Props = ReduxProps & ReduxStateProps & ComponentProps;

type State = {};

export const TransitionInMillis = 400;
export const TransitionOutMillis = 400;

class AccountVerification extends Component<Props, State> {
  _transitionValue: Animated.Value;

  constructor(props: Props) {
    super(props);
    this._transitionValue = new Animated.Value(props.show ? 1.0 : 0.0);
    this.state = {};
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.show === this.props.show) {
      return;
    }
    Animated.timing(this._transitionValue, {
      duration: nextProps.show ? TransitionInMillis : TransitionOutMillis,
      easing: Easing.out(Easing.cubic),
      toValue: nextProps.show ? 1.0 : 0.0,
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
              <Content>{this._renderSearch()}</Content>
              <FooterWithButtons
                buttonLayout={{ type: 'CENTER', centerButtonText: 'CANCEL' }}
                onPress={this._onFooterButtonPress}
              />
            </Screen>
          </SafeAreaView>
        </Animated.View>
      </KeyboardAvoidingView>
    );
  }

  _renderSearch() {
    return <View style={styles.search} />;
  }

  _onFooterButtonPress = (button: 'LEFT' | 'RIGHT' | 'CENTER'): void => {
    if (this._isCancelButton(button)) {
      this.props.dispatch(dismissAccountVerification());
    }
    console.log(button);
  };

  _onPressBackground = (): void => {
    console.log('pressing background?');
  };

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

  search: {
    borderBottomWidth: 1,
    borderColor: Colors.BORDER_HAIRLINE,
    // Add 1 since hairline border is not inclusive of width in normal nav bar.
    height: NavBarHeight + 1,
  },
});
