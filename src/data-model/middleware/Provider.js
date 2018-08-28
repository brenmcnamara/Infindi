/* @flow */

import Provider from 'common/lib/models/Provider';
import ProviderFetcher from 'common/lib/models/ProviderFetcher';
import ProviderMutator from 'common/lib/models/ProviderMutator';
import Middleware from './Middleware';

import type {
  ProviderCollection,
  ProviderOrderedCollection,
  ProviderRaw,
} from 'common/lib/models/Provider';

export default class ProviderMiddleware extends Middleware<
  'Provider',
  ProviderRaw,
  Provider,
  ProviderCollection,
  ProviderOrderedCollection,
  typeof ProviderFetcher,
  typeof ProviderMutator,
> {
  static __ModelCtor = Provider;
  static __ModelFetcher = ProviderFetcher;
  static __ModelMutator = ProviderMutator;
}
