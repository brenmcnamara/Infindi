/* @flow */

import AccountLink from 'common/lib/models/AccountLink';

import {
  generateActionCreators,
  generateCreateCursor,
  generateCreateListener,
} from './Actions';

import type {
  AccountLinkCollection,
  AccountLinkRaw,
} from 'common/lib/models/AccountLink';
import type { Action as ActionTemplate } from './Actions';
import type { ModelCursor, ModelListener, ModelQuery } from '../_types';

// eslint-disable-next-line flowtype/generic-spacing
export type Action = ActionTemplate<
  'AccountLink',
  AccountLinkRaw,
  AccountLink,
  AccountLinkCollection,
>;

type CreateListener = (query: ModelQuery) => ModelListener<'AccountLink'>;
type CreateCursor = (query: ModelQuery) => ModelCursor<'AccountLink'>;

// $FlowFixMe - Template types are correct.
export const createListener: CreateListener = generateCreateListener(
  AccountLink,
);
// $FlowFixMe - Template types are correct.
export const createCursor: CreateCursor = generateCreateCursor(AccountLink);

export default generateActionCreators(AccountLink);
