/* @flow */

import React from 'react';

import { connect } from 'react-redux';
import { getIsAuthenticated } from '../../auth/state-utils';

import { type ReduxProps } from '../../store';
import { type State } from '../../reducers/root';

type Props = ReduxProps & {
  children?: ?any,
  isAuthenticated: boolean,
};

function mapReduxStateToProps(state: State) {
  return {
    isAuthenticated: getIsAuthenticated(state),
  };
}

export default connect(mapReduxStateToProps)((props: Props) => {
  if (props.isAuthenticated) {
    return React.Children.only(props.children);
  }
  return null;
});
