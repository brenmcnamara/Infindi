/* @flow */

import { createModelCollectionReducer } from '../datastore';

import type { ModelCollection, ModelState } from '../datastore';
import type { RefreshInfo } from 'common/lib/models/RefreshInfo';

export type RefreshInfoCollection = ModelCollection<'RefreshInfo', RefreshInfo>;

export type State = ModelState<'RefreshInfo', RefreshInfo>;

const accounts: (state: State, action: *) => * = createModelCollectionReducer(
  'RefreshInfo',
);

export default accounts;
