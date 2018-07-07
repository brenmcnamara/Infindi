/* @flow */

import Provider from 'common/lib/models/Provider';

import {
  generateActionCreators,
  generateCreateCursor,
  generateCreateListener,
} from './Actions';

import type { Action as ActionTemplate } from './Actions';
import type {
  ProviderCollection,
  ProviderRaw,
} from 'common/lib/models/Provider';
import type { ModelCursor, ModelListener, ModelQuery } from '../_types';

// eslint-disable-next-line flowtype/generic-spacing
export type Action = ActionTemplate<
  'Provider',
  ProviderRaw,
  Provider,
  ProviderCollection,
>;

type CreateListener = (query: ModelQuery) => ModelListener<'Provider'>;
type CreateCursor = (query: ModelQuery) => ModelCursor<'Provider'>;

// $FlowFixMe - Template types are correct.
export const createListener: CreateListener = generateCreateListener(Provider);
// $FlowFixMe - Template types are correct.
export const createCursor: CreateCursor = generateCreateCursor(Provider);

export default generateActionCreators(Provider);
