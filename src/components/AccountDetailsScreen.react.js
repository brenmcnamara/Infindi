/* @flow */

import Content from './shared/Content.react';
import React, { Component } from 'react';
import Screen from './shared/Screen.react';

import { connect } from 'react-redux';

import type { ID } from 'common/types/core';
import type { ReduxProps } from '../typesDEPRECATED/redux';
import type { State as ReduxState } from '../reducers/root';

export type Props = ReduxProps & ComponentProps & ComputedProps;

type ComponentProps = {
  accountID: ID,
};

type ComputedProps = {};

class AccountDetailsScreen extends Component<Props> {
  render() {
    return (
      <Screen>
        <Content />
      </Screen>
    );
  }
}

function mapReduxStateToProps(state: ReduxState): ComputedProps {
  return {};
}

export default connect(mapReduxStateToProps)(AccountDetailsScreen);
