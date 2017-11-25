/* @flow */

import LoadingScreen from '../LoadingScreen.react';
import LoginScreen from '../LoginScreen.react';
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { isAuthenticated } from '../../store/state-utils';
import { Modal, View } from 'react-native';

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
  passThroughProps: *,
};

/**
 * Will show a login / splash modal while the user is not logged in. The user
 * must login / sign up before entering the rest of the app.
 */
class AuthenticationGuard extends Component<Props> {
  render() {
    return (
      <View>
        <Modal animationType="none" show={true}>
          <LoginScreen transitionInLogin={false} />
        </Modal>
      </View>
    );
  }
}

const mapReduxStateToProps = (state: State) => {
  return {
    isAuthenticated: isAuthenticated(state),
  };
};

const ConnectedAuthenticationGuard = connect(mapReduxStateToProps)(
  AuthenticationGuard,
);
