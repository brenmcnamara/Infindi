/* @flow */

import Content from '../../components/shared/Content.react';
import FooterWithButton from '../../components/shared/FooterWithButtons.react';
import React, { Component } from 'react';
import Screen from '../../components/shared/Screen.react';

import invariant from 'invariant';

import { connect } from 'react-redux';
import { GetTheme } from '../../design/components/Theme.react';
import { StyleSheet, View } from 'react-native';

import type { ReduxProps, ReduxState } from '../../store';
import type { Theme } from '../../design/themes';

export type Props = ReduxProps & ComponentProps & ComputedProps;

type ComponentProps = {};

type ComputedProps = {};

class SignUpScreen extends Component<Props> {
  render() {
    return (
      <GetTheme>
        {(theme: Theme) => (
          <Screen avoidKeyboard={true} avoidNavbar={true}>
            <Content>
              <View style={styles.root} />
            </Content>
            <FooterWithButton
              buttonLayout={{
                centerButtonText: 'CREATE ACCOUNT',
                isCenterButtonDisabled: true,
                type: 'CENTER',
              }}
              onPress={this._onPressFooterButton}
            />
          </Screen>
        )}
      </GetTheme>
    );
  }

  _onPressFooterButton = (button: *): void => {
    invariant(
      button === 'CENTER',
      'Expecting pressed button to be in the center',
    );
  };
}

function mapReduxStateToProps(state: ReduxState): ComputedProps {
  return {};
}

export default connect(mapReduxStateToProps)(SignUpScreen);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
