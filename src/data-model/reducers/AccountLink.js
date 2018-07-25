/* @flow */

import AccountLink from 'common/lib/models/AccountLink';

import { generateReducer } from './Reducer';

import type {
  AccountLinkCollection,
  AccountLinkRaw,
} from 'common/lib/models/AccountLink';
import type { State as StateTemplate } from './Reducer';

// eslint-disable-next-line flowtype/generic-spacing
export type State = StateTemplate<
  'AccountLink',
  AccountLinkRaw,
  AccountLink,
  AccountLinkCollection,
>;

export default generateReducer(AccountLink);
