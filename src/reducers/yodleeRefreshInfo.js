/* @flow */

import { createModelCollectionReducer } from '../datastore';

import type { YodleeRefreshInfo } from 'common/lib/models/YodleeRefreshInfo';
import type {
  ModelLoader,
  ModelLoaderCollection,
  ModelLoaderState,
} from '../datastore';

export type AccountLoader = ModelLoader<'YodleeRefreshInfo', YodleeRefreshInfo>;

export type AccountLoaderCollection = ModelLoaderCollection<'YodleeRefreshInfo',
  YodleeRefreshInfo,>;

export type State = ModelLoaderState<'YodleeRefreshInfo', YodleeRefreshInfo>;

const accounts: (state: State, action: *) => * = createModelCollectionReducer(
  'YodleeRefreshInfo',
);

export default accounts;
