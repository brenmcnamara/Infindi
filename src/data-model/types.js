/* @flow */

import type { AccountLink } from 'common/lib/models/AccountLink';
import type { ID } from 'common/types/core';
import type { ModelContainer } from '../datastore';
import type { Provider } from 'common/lib/models/Provider';

export type ProviderContainer = { [providerID: ID]: Provider };

export type ProviderFetchStatus = 'EMPTY' | 'LOADING' | 'STEADY' | 'FAILURE';

export type AccountLinkContainer = ModelContainer<'AccountLink', AccountLink>;
