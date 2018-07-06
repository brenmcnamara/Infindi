/* @flow */

import Provider from 'common/lib/models/Provider';

import { generateReducer } from './Reducer';

import type { ProviderRaw } from 'common/lib/models/Provider';
import type { State as StateTemplate } from './Reducer';

export type State = StateTemplate<'Provider', ProviderRaw, Provider>;

export default generateReducer(Provider);
