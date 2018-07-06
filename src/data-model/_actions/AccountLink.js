/* @flow */

import AccountLink from 'common/lib/models/AccountLink';

import {
  generateActionCreators,
  generateCreateListener,
  generateCreatePageCursor,
} from './Actions';

import type {
  AccountLinkCollection,
  AccountLinkRaw,
} from 'common/lib/models/AccountLink';
import type { Action as ActionTemplate } from './Actions';

// eslint-disable-next-line flowtype/generic-spacing
export type Action = ActionTemplate<
  'AccountLink',
  AccountLinkRaw,
  AccountLink,
  AccountLinkCollection,
>;

export const createListener = generateCreateListener(AccountLink);
export const createPageCursor = generateCreatePageCursor(AccountLink);

export default generateActionCreators(AccountLink);
