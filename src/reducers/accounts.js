/* @flow */

import { createModelCollectionReducer } from '../datastore';

import type { Account } from 'common/lib/models/Account';
import type {
  ModelLoader,
  ModelLoaderCollection,
  ModelLoaderState,
} from '../datastore';

export type AccountLoader = ModelLoader<'Account', Account>;

export type AccountLoaderCollection = ModelLoaderCollection<'Account', Account>;

export type State = ModelLoaderState<'Account', Account>;

const accounts: (state: State, action: *) => * = createModelCollectionReducer(
  'Account',
);

export default accounts;
