/* @flow */

import { createModelCollectionReducer } from '../datastore';

import type { YodleeRefreshInfo } from 'common/lib/models/YodleeRefreshInfo';
import type {
  ModelLoader,
  ModelLoaderCollection,
  ModelLoaderState,
} from '../datastore';

export type YodleeRefreshInfoLoader = ModelLoader<'YodleeRefreshInfo',
  YodleeRefreshInfo,>;

export type YodleeRefreshInfoLoaderCollection = ModelLoaderCollection<'YodleeRefreshInfo',
  YodleeRefreshInfo,>;

export type State = ModelLoaderState<'YodleeRefreshInfo', YodleeRefreshInfo>;

const accounts: (state: State, action: *) => * = createModelCollectionReducer(
  'YodleeRefreshInfo',
);

export default accounts;
