/* @flow */

import { createModelContainerReducer } from '../../datastore';

import type { AccountLink } from 'common/lib/models/AccountLink';
import type { ModelContainer, ModelState } from '../../datastore';

export type AccountLinkContainer = ModelContainer<'AccountLink', AccountLink>;

export type State = ModelState<'AccountLink', AccountLink>;

const accounts: (state: State, action: *) => * = createModelContainerReducer(
  'AccountLink',
);

export default accounts;
