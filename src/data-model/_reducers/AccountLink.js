/* @flow */

import AccountLink from 'common/lib/models/AccountLink';

import { generateReducer } from './Reducer';

import type { AccountLinkRaw } from 'common/lib/models/AccountLink';
import type { State as StateTemplate } from './Reducer';

export type State = StateTemplate<'AccountLink', AccountLinkRaw, AccountLink>;

export default generateReducer(AccountLink);
