/* @flow */

import Provider from 'common/lib/models/Provider';

import { generateReducer } from './Reducer';

import type {
  ProviderCollection,
  ProviderRaw,
} from 'common/lib/models/Provider';
import type { State as StateTemplate } from './Reducer';

// eslint-disable-next-line flowtype/generic-spacing
export type State = StateTemplate<
  'Provider',
  ProviderRaw,
  Provider,
  ProviderCollection,
>;

export default generateReducer(Provider);
