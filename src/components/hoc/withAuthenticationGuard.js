/* @flow */

import LoadingScreen from '../LoadingScreen.react';
import LoginScreen from '../LoginScreen.react';
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Modal as ModalRaw, StyleSheet, View } from 'react-native';

import { type AuthStatusType } from '../../reducers/authStatus';
import { type ReduxProps } from '../../types/redux';
import { type State } from '../../reducers/root';

export default function withAuthenticationGuard(component: *) {
  return (props: *) => {
    return (
      <ConnectedAuthenticationGuard
        component={component}
        passThroughProps={props}
      />
    );
  };
}

type Props = ReduxProps & {
  component: *,
  authStatusType: AuthStatusType,
  passThroughProps: *,
};

/**
 * Will show a login / splash modal while the user is not logged in. The user
 * must login / sign up before entering the rest of the app.
 */
class AuthenticationGuard extends Component<Props> {
  render() {
    const Comp = this.props.component;
    const comp = <Comp {...this.props.passThroughProps} />;
    switch (this.props.authStatusType) {
      case 'NOT_INITIALIZED':
        return (
          <Root>
            <Modal>
              <LoadingScreen />
            </Modal>
            {comp}
          </Root>
        );

      case 'LOGGED_OUT':
      case 'LOGOUT_INITIALIZE':
      case 'LOGOUT_FAILURE':
        return (
          <Root>
            <Modal>
              <LoginScreen type="NORMAL" />
            </Modal>
            {comp}
          </Root>
        );

      case 'LOGIN_INITIALIZE':
        return (
          <Root>
            <Modal>
              <LoginScreen type="LOADING" />
            </Modal>
            {comp}
          </Root>
        );

      case 'LOGIN_FAILURE':
        return (
          <Root>
            <Modal>
              <LoginScreen type="ERROR" />
            </Modal>
            {comp}
          </Root>
        );

      case 'LOGGED_IN':
        return (
          <Root>
            <Comp {...this.props.passThroughProps} />
          </Root>
        );
    }
  }
}

const mapReduxStateToProps = (state: State) => {
  return {
    authStatusType: state.authStatus.type,
  };
};

const ConnectedAuthenticationGuard = connect(mapReduxStateToProps)(
  AuthenticationGuard,
);

const Modal = (props: { children?: ?any }) => {
  return (
    <View>
      <ModalRaw animationType="fade" show={true}>
        {props.children}
      </ModalRaw>
    </View>
  );
};

const AUTH_GUARD_KEY = 'AUTH_GUARD';

const Root = (props: { children?: ?any }) => {
  return (
    <View key={AUTH_GUARD_KEY} style={styles.root}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
});
