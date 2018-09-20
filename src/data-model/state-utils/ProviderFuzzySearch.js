/* @flow */

import type { LoadState } from '../types';
import type { ReduxState } from '../../store';

function getInitialLoadState(reduxState: ReduxState): LoadState {
  return reduxState.providerFuzzySearch.initialLoadState;
}

export default {
  getInitialLoadState,
};
