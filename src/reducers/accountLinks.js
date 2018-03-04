/* @flow */

import { createModelCollectionReducer } from '../datastore';

import type { AccountLink } from 'common/lib/models/AccountLink';
import type { ModelCollection, ModelState } from '../datastore';

export type AccountLinkCollection = ModelCollection<'AccountLink', AccountLink>;

export type State = ModelState<'AccountLink', AccountLink>;

const accounts: (state: State, action: *) => * = createModelCollectionReducer(
  'AccountLink',
);

export default accounts;
