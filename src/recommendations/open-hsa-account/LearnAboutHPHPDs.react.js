/* @flow */

import React, { Component } from 'react';

import { LearnAboutHPHPDsURI } from './Metadata';
import { WebView } from 'react-native';

export type Props = {};

export default class LearnAboutHPHPDs extends Component<Props> {
  render() {
    return <WebView source={{ uri: LearnAboutHPHPDsURI }} />;
  }
}
