/* @flow */

import AccountLink from 'common/lib/models/AccountLink';

import { generateStateUtils } from './StateUtils';

import type {
  AccountLinkCollection,
  AccountLinkOrderedCollection,
  AccountLinkRaw,
} from 'common/lib/models/AccountLink';
import type { StateUtils as StateUtilsTemplate } from './StateUtils';

// eslint-disable-next-line flowtype/generic-spacing
export type StateUtils = StateUtilsTemplate<
  'AccountLink',
  AccountLinkRaw,
  AccountLink,
  AccountLinkCollection,
  AccountLinkOrderedCollection,
>;

export default generateStateUtils(
  AccountLink,
  reduxState => reduxState.accountLink,
);
