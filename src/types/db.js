/* @flow */

import {
  type Fuzzy,
  type ID,
  type Location,
  type SecondsSinceEpoch,
  type YearMonthDay,
} from './core';

/**
 * Firebase has a pre-defined User type, which is a bare-bones model containing
 * some basic information for authentication purposes. The 'UserInfo' Object
 * contains other, relevant informtion about a User that we care about.
 * This has a 1:1 relationship between a firebase User and shares the same
 * id.
 */
export type UserInfo = {|
  +currentResidence: Fuzzy<Location>,
  +createdAt: SecondsSinceEpoch,
  +DOB: YearMonthDay,
  +firstName: string,
  +id: ID,
  +lastName: string,
  +modelType: 'UserInfo',
  +type: 'MODEL',
  +updatedAt: SecondsSinceEpoch,
|};
