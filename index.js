/* @flow */

import AppContainer from './src/components/AppContainer.react';

import { AppRegistry, Text, View } from 'react-native';

AppRegistry.registerComponent('Infindi', () => AppContainer);

// -----------------------------------------------------------------------------
//
// DEBUGGER GLOBALS
//
// -----------------------------------------------------------------------------

import ModalTransition from './src/components/shared/ModalTransition.react';
import React from 'react';
import Store from './src/store';

import { login, logout } from './src/actions/authentication';

import type { ID } from 'common/src/types/core';

if (__DEV__) {
  const TEST_EMAIL = 'infindi.testing@gmail.com';
  const TEST_PWORD = 'public_password2';

  global.loginTestUser = () => {
    Store.dispatch(login({ email: TEST_EMAIL, password: TEST_PWORD }));
  };

  global.logout = () => {
    Store.dispatch(logout());
  };

  global.showModal = (id: ID) => {
    Store.dispatch({
      modal: {
        id,
        modalType: 'REACT',
        priority: 'USER_REQUESTED',
        render: () => (
          <ModalTransition
            onPressBackground={() => global.hideModal(id)}
            show={true}
          >
            <View
              style={{
                alignItems: 'center',
                height: 100,
                justifyContent: 'center',
                width: 100,
              }}
            >
              <Text>{id}</Text>
            </View>
          </ModalTransition>
        ),
      },
      type: 'REQUEST_MODAL',
    });
  };

  global.hideModal = (id: ID) => {
    Store.dispatch({
      modalID: id,
      type: 'DISMISS_MODAL',
    });
  };
}
