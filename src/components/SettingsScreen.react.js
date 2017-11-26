/* @flow */

import Content from './shared/Content.react';
import React, { Component } from 'react';
import Screen from './shared/Screen.react';

import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';

import { type State } from '../reducers/root';

export type Props = {};

class SettingsScreen extends Component<Props> {
  render() {
    return <View style={{ backgroundColor: 'blue' }} />;
  }
}

const mapReduxStateToProps = (state: State) => ({});

export default connect(mapReduxStateToProps)(SettingsScreen);

const styles = StyleSheet.create({});
