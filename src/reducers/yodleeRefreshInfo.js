/* @flow */

import { createModelCollectionReducer } from '../datastore';

import type { YodleeRefreshInfo } from 'common/lib/models/YodleeRefreshInfo';
import type { ModelCollection, ModelState } from '../datastore';

export type YodleeRefreshInfoCollection = ModelCollection<'YodleeRefreshInfo',
  YodleeRefreshInfo,>;

export type State = ModelState<'YodleeRefreshInfo', YodleeRefreshInfo>;

const accounts: (state: State, action: *) => * = createModelCollectionReducer(
  'YodleeRefreshInfo',
);

export default accounts;
