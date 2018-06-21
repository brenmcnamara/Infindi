/* @flow */

import AppNavigator from '../navigation/AppNavigator.react';
import CalculateGlobalTheme from '../core/CalculateGlobalTheme.react';
import ModalManager from '../components/ModalManager.react';
import React, { Component } from 'react';
import Store from '../store';

import { GetTheme } from '../design/components/Theme.react';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';

import type { Theme, ThemeName } from '../design/themes';

export type Props = ComputedProps;

type ComputedProps = {
  theme: ThemeName,
};

export default class AppContainer extends Component<Props> {
  render() {
    return (
      <Provider store={Store}>
        <CalculateGlobalTheme>
          <GetTheme>
            {(theme: Theme) => (
              <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <SafeAreaView
                  style={[
                    styles.safeArea,
                    { backgroundColor: theme.color.backgroundMain },
                  ]}
                >
                  <ModalManager />
                  <AppNavigator />
                </SafeAreaView>
              </KeyboardAvoidingView>
            )}
          </GetTheme>
        </CalculateGlobalTheme>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
