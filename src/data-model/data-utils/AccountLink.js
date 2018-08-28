/* @flow */

/* eslint-disable flowtype/generic-spacing */

import AccountLink from 'common/lib/models/AccountLink';

import { generateDataUtils } from './DataUtils';

import type { DataUtils } from './DataUtils';

const AccountLinkDataUtils: DataUtils<'AccountLink'> = generateDataUtils(
  AccountLink,
);

export default AccountLinkDataUtils;
