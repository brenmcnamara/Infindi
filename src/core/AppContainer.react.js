/* @flow */

import AppNavigator from '../navigation/AppNavigator.react';
import React, { Component } from 'react';
import Store from '../store';
import ThemeProvider, { GetTheme } from '../design/components/Theme.react';

import { KeyboardAvoidingView, SafeAreaView, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';

export default class AppContainer extends Component<{}> {
  render() {
    return (
      <Provider store={Store}>
        <ThemeProvider themeName="light">
          <GetTheme>
            {theme => (
              <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <SafeAreaView
                  style={[
                    styles.safeArea,
                    {
                      backgroundColor: theme.color.backgroundMain,
                    },
                  ]}
                >
                  <AppNavigator />
                </SafeAreaView>
              </KeyboardAvoidingView>
            )}
          </GetTheme>
        </ThemeProvider>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
