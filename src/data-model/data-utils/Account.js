/* @flow */

/* eslint-disable flowtype/generic-spacing */

import Account from 'common/lib/models/Account';

import { generateDataUtils } from './DataUtils';

import type { DataUtils } from './DataUtils';

const AccountDataUtils: DataUtils<'Account'> = generateDataUtils(Account);

export default AccountDataUtils;
