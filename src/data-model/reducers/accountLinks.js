/* @flow */

import { createModelContainerReducer } from '../../datastore';

import type AccountLink, {
  AccountLinkRaw,
} from 'common/lib/models/AccountLink';

import type { ModelState } from '../../datastore';
import type { Reducer } from '../../store';

export type State = ModelState<'AccountLink', AccountLinkRaw, AccountLink>;

const accounts: Reducer<State> = createModelContainerReducer('AccountLink');

export default accounts;
