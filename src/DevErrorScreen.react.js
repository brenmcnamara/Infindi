/* @flow */

import * as React from 'react';
import Content from './shared/Content.react';
import Screen from './shared/Screen.react';

import { GetTheme } from './design/components/Theme.react';
import { StyleSheet, Text, View } from 'react-native';

export type Props = {
  message: string,
};

export default class DevErrorScreen extends React.Component<Props> {
  render() {
    return (
      <Screen>
        <Content>
          <GetTheme>
            {theme => (
              <View style={styles.root}>
                <Text style={[theme.getTextStyleHeader2(), styles.header]}>
                  {'Unexpected Error'}
                </Text>
                <Text style={[theme.getTextStyleAlert(), styles.errorMessage]}>
                  {this.props.message}
                </Text>
              </View>
            )}
          </GetTheme>
        </Content>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  errorMessage: {
    marginTop: 24,
    textAlign: 'center',
  },

  header: {
    marginTop: 40,
  },

  root: {
    alignItems: 'center',
    flex: 1,
    margin: 40,
  },
});
