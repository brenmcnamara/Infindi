/* @flow */

import type { Provider } from 'common/lib/models/Provider';
import type { ReduxState } from '../../store';

export function getProviders(state: ReduxState): Array<Provider> {
  return state.providers.ordering.map(id => state.providers.container[id]);
}
