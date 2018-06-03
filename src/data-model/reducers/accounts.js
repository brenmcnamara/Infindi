/* @flow */

import { createModelContainerReducer } from '../../datastore';

import type { AccountRaw } from 'common/lib/models/Account';
import type { ModelContainer, ModelState } from '../../datastore';

export type AccountContainer = ModelContainer<'Account', AccountRaw>;

export type State = ModelState<'Account', AccountRaw>;

const accounts: (state: State, action: *) => * = createModelContainerReducer(
  'Account',
);

export default accounts;
