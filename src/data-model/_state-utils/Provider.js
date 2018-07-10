/* @flow */

import Provider from 'common/lib/models/Provider';

import { generateStateUtils } from './StateUtils';

import type {
  ProviderCollection,
  ProviderRaw,
} from 'common/lib/models/Provider';
import type { StateUtils as StateUtilsTemplate } from './StateUtils';

// eslint-disable-next-line flowtype/generic-spacing
export type StateUtils = StateUtilsTemplate<
  'Provider',
  ProviderRaw,
  Provider,
  ProviderCollection,
>;

export default generateStateUtils(Provider, reduxState => reduxState._provider);