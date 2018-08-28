/* @flow */

/* eslint-disable flowtype/generic-spacing */

import UserInfo from 'common/lib/models/UserInfo';

import { generateDataUtils } from './DataUtils';

import type { DataUtils } from './DataUtils';

const UserInfoDataUtils: DataUtils<'UserInfo'> = generateDataUtils(UserInfo);

export default UserInfoDataUtils;
