/* @flow */

import Provider from 'common/lib/models/Provider';

import {
  generateActionCreators,
  generateCreateListener,
  generateCreatePageCursor,
} from './Actions';

import type { Action as ActionTemplate } from './Actions';
import type {
  ProviderCollection,
  ProviderRaw,
} from 'common/lib/models/Provider';

// eslint-disable-next-line flowtype/generic-spacing
export type Action = ActionTemplate<
  'Provider',
  ProviderRaw,
  Provider,
  ProviderCollection,
>;

export const createListener = generateCreateListener(Provider);
export const createPageCursor = generateCreatePageCursor(Provider);

export default generateActionCreators(Provider);
