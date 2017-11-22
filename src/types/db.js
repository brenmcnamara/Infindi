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
  +gender: ?Fuzzy<'MALE' | 'FEMALE'>,
  +id: ID,
  +lastName: string,
  +modelType: 'UserInfo',
  +roleInline: UserRole,
  +type: 'MODEL',
  +updatedAt: SecondsSinceEpoch,
|};

/**
 * This is a detailed object containing the permissions that a partcilar
 * user has. Once created, this cannot be mutated, except through some
 * priveledges process run by an admin.
 *
 * NOTE: The user role is inlined into the user info object. While this will
 * result in a ton of extra state being generated (there are probably only a few
 * configurations role that we care about) as well as some other headaches, we
 * have to do it this way due to limitations on how you can define security
 * rules in Firebase. Would like to eventually move this out into its own table.
 *
 * For documentation on how firebase authorization rules work,
 * start here: https://firebase.google.com/docs/database/security/quickstart
 *
 * For an api reference on how to define new rules, start here:
 * https://firebase.google.com/docs/database/security/securing-data
 */
export type UserRole = {|
  +alias: string, // Human-readable name for the role
  +canAddAccount: bool,
  +createdAt: SecondsSinceEpoch,
  +id: ID,
  +modelType: 'UserRole',
  +type: 'MODEL',
  +updatedAt: SecondsSinceEpoch,
|};

/**
 * A session of the user using the product. This includes information about
 * the start and end time of the session, device information, and location,
 * if available. The purpose of this object is for debugging, insight, and
 * security.
 *
 * Debugging: We may attach debugging logs to the session, so we can have a
 * sense of the user experience in case anything went wrong.
 *
 * Insight: We can use frequency of log-ins and activity during the session
 * to personalize our product for users.
 *
 * Security: By keeping track of when someone logs in and with which device,
 * we can detect security anonolies like: logging in from a new device,
 * logging in simultaneously in multiple places, etc...
 */
export type UserSession = {|
  +id: ID,
  +createdAt: SecondsSinceEpoch,
  +modelType: 'UserSession',
  +type: 'MODEL',
  +updatedAt: SecondsSinceEpoch,
|};

/**
 * TODO: Add some documentation here.
 */
export type UserDebugLogs = {|
  +id: ID,
  +createdAt: SecondsSinceEpoch,
  +modelType: 'UserDebugLogs',
  +type: 'MODEL',
  +updatedAt: SecondsSinceEpoch,
|};
