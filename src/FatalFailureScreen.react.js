/* @flow */

import Content from './shared/components/Content.react';
import Icons from './design/icons';
import React, { Component } from 'react';
import Screen from './shared/components/Screen.react';
import TextDesign from './design/text';

import invariant from 'invariant';

import { connect } from 'react-redux';
import { Image, StyleSheet, Text, View } from 'react-native';

import type FindiError from 'common/lib/FindiError';

import type { Action, ReduxProps, ReduxState } from './store';

export type Props = ReduxProps & ComponentProps & ComputedProps;

type ComponentProps = {};

type ComputedProps = {
  error: FindiError,
  retryAction: Action,
};

class FatalFailureScreen extends Component<Props> {
  render() {
    return (
      <Screen>
        <Content>
          <View style={styles.root}>
            <Image source={Icons.ErrorLarge} />
            <Text style={[styles.text, TextDesign.header3]}>
              {this.props.error.errorMessage}
            </Text>
          </View>
        </Content>
      </Screen>
    );
  }
}

function mapReduxStateToProps(reduxState: ReduxState): ComputedProps {
  const { error, retry } = reduxState.fatalFailure;
  invariant(error, 'Expecting initializationFailure to have an error');
  invariant(retry, 'Expecting initializationFailure to have a retry action');
  return {
    error,
    retryAction: retry,
  };
}

export default connect(mapReduxStateToProps)(FatalFailureScreen);

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    flex: 1,
    marginTop: 140,
  },

  text: {
    paddingHorizontal: 40,
    paddingTop: 60,
    textAlign: 'center',
  },
});
