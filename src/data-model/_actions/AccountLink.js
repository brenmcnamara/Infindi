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
import type { ModelCursor, ModelListener } from '../_types';
import type { ModelOrderedQuery, ModelQuery } from 'common/lib/models/Model';

// eslint-disable-next-line flowtype/generic-spacing
export type Action = ActionTemplate<
  'AccountLink',
  AccountLinkRaw,
  AccountLink,
  AccountLinkCollection,
>;

type CreateCursor = (
  query: ModelOrderedQuery,
  pageSize: number,
) => ModelCursor<'AccountLink'>;
type CreateListener = (query: ModelQuery) => ModelListener<'AccountLink'>;

// $FlowFixMe - Template types are correct.
export const createListener: CreateListener = generateCreateListener(
  AccountLink,
);
// $FlowFixMe - Template types are correct.
export const createCursor: CreateCursor = generateCreateCursor(AccountLink);

export default generateActionCreators(AccountLink);
