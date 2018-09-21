/* @flow */

import * as React from 'react';
import Content from './shared/components/Content.react';
import Icons from './design/icons';
import LifeCycleActions from './life-cycle/Actions';
import Screen from './shared/components/Screen.react';
import TextButton from './shared/components/TextButton.react';

import { CheckInternet } from '../content';
import { connect } from 'react-redux';
import { GetTheme } from './design/components/Theme.react';
import { Image, StyleSheet, Text, View } from 'react-native';

import type { ReduxProps } from './store';

export type Props = ReduxProps & {};

class CheckInternetScreen extends React.Component<Props> {
  render() {
    return (
      <GetTheme>
        {theme => (
          <Screen>
            <Content>
              <View style={styles.root}>
                <Image source={Icons.ErrorLarge} />
                <Text style={[styles.text, theme.getTextStyleHeader3()]}>
                  {CheckInternet}
                </Text>
                <View style={styles.retryContainer}>
                  <TextButton
                    onPress={this._onPressTryAgain}
                    size="LARGE"
                    text="Try again"
                    type="SPECIAL"
                  />
                </View>
              </View>
            </Content>
          </Screen>
        )}
      </GetTheme>
    );
  }

  _onPressTryAgain = (): void => {
    this.props.dispatch(LifeCycleActions.retryAppInitialization());
  };
}

export default connect()(CheckInternetScreen);

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    flex: 1,
    marginTop: 140,
  },

  text: {
    paddingHorizontal: 40,
    paddingTop: 40,
    textAlign: 'center',
  },

  retryContainer: {
    paddingTop: 20,
  },
});
