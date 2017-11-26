/* @flow */

import React from 'react';

import { connect } from 'react-redux';

import { type ReduxProps } from '../../types/redux';
import { type State } from '../../reducers/root';

type Props = ReduxProps & {
  children?: ?any,
  isAuthenticated: bool,
};

function mapReduxStateToProps(state: State) {
  return {
    isAuthenticated: state.authStatus.type === 'LOGGED_IN',
  };
}

export default connect(mapReduxStateToProps)((props: Props) => {
  if (props.isAuthenticated) {
    return React.Children.only(props.children);
  }
  return null;
});
