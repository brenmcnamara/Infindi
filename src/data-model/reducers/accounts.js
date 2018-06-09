/* @flow */

import { createModelContainerReducer } from '../../datastore';

import type Account, { AccountRaw } from 'common/lib/models/Account';

import type { ModelState } from '../../datastore';
import type { Reducer } from '../../store';

export type State = ModelState<'Account', AccountRaw, Account>;

const accounts: Reducer<State> = createModelContainerReducer('Account');

export default accounts;
