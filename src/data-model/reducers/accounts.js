/* @flow */

import { createModelContainerReducer } from '../../datastore';

import type { Account } from 'common/lib/models/Account';
import type { ModelContainer, ModelState } from '../../datastore';

export type AccountContainer = ModelContainer<'Account', Account>;

export type State = ModelState<'Account', Account>;

const accounts: (state: State, action: *) => * = createModelContainerReducer(
  'Account',
);

export default accounts;
