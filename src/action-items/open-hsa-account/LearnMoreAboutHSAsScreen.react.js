/* @flow */

import React, { Component } from 'react';

import { LearnMoreAboutHSAsURI } from './Metadata';
import { WebView } from 'react-native';

export type Props = {};

export default class LearnMoreAboutHSAsScreen extends Component<Props> {
  render() {
    return <WebView source={{ uri: LearnMoreAboutHSAsURI }} />;
  }
}
