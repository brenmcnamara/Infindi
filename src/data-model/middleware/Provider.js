/* @flow */

import Provider from 'common/lib/models/Provider';
import Middleware from './Middleware';

import type { ProviderCollection, ProviderRaw } from 'common/lib/models/Provider';

export default class ProviderMiddleware extends Middleware<
  'Provider',
  ProviderRaw,
  Provider,
  ProviderCollection,
> {
  static __ModelCtor = Provider;
}
