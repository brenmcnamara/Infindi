/* @flow */

import * as React from 'react';

import {connect} from 'react-redux';
import {StyleSheet} from 'react-native';

// eslint-disable-next-line import/no-unresolved
import {ReduxProps, ReduxState} from './store'; // TODO: Fix path

export type Props = ReduxProps & ComponentProps & ComputedProps;

type ComponentProps = {}; // TODO: Create type

type ComputedProps = {}; // TODO: Create type

type State = {};

/**
 * TODO: Fill in the document here.
 * TODO: Rename the component
 */
class Component extends React.Component<Props, State> {
  state: State = {};

  render() {
    // TODO: Implement me
  }
}


function mapReduxStateToProps(reduxState: ReduxState): ComputedProps {
  return {}; // TODO: Implement me
}

// TODO: Styles
const styles = StyleSheet.create({});

export default connect(mapReduxStateToProps)(Component); // TODO: Rename component
