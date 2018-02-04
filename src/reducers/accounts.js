/* @flow */

import { createModelCollectionReducer } from '../datastore';

import type { Account } from 'common/lib/models/Account';
import type { ModelCollection, ModelState } from '../datastore';

export type AccountCollection = ModelCollection<'Account', Account>;

export type State = ModelState<'Account', Account>;

const accounts: (state: State, action: *) => * = createModelCollectionReducer(
  'Account',
);

export default accounts;
