/* @flow */

import type { ID } from 'common/types/core';
import type { Provider } from 'common/lib/models/Provider';

export type ProviderContainer = { [providerID: ID]: Provider };

export type ProviderFetchStatus = 'EMPTY' | 'LOADING' | 'STEADY' | 'FAILURE';
