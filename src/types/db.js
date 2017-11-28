/* @flow */

import { type Firebase$User } from './firebase';
import {
  type Fuzzy,
  type Location,
  type ModelStub,
  type YearMonthDay,
} from './core';

/**
 * Login credentials used to login a user.
 */
export type LoginCredentials = {|
  +email: string,
  +password: string,
|};

/**
 * Login payload that is returned given a success login.
 */
export type LoginPayload = {|
  +firebaseUser: Firebase$User,
  +idToken: string,
  +userInfo: UserInfo,
|};

/**
 * Firebase has a pre-defined User type, which is a bare-bones model containing
 * some basic information for authentication purposes. The 'UserInfo' Object
 * contains other, relevant informtion about a User that we care about.
 * This has a 1:1 relationship between a firebase User and shares the same
 * id.
 */
export type UserInfo = ModelStub<'UserInfo'> & {|
  +currentResidence: Fuzzy<Location>,
  +DOB: YearMonthDay,
  +firstName: string,
  +gender: ?Fuzzy<'MALE' | 'FEMALE'>,
  +isTestUser: bool,
  +lastName: string,
  +accessInline: UserAccess,
|};

/**
 * This is a detailed object containing the permissions that a partcilar
 * user has. Once created, this cannot be mutated, except through some
 * priveledges process run by an admin.
 *
 * NOTE: The user access is inlined into the user info object. While this will
 * result in a ton of extra state being generated (there are probably only a few
 * configurations access that we care about) as well as some other headaches, we
 * have to do it this way due to limitations on how you can define security
 * rules in Firebase. Would like to eventually move this out into its own table.
 *
 * For documentation on how firebase authorization rules work,
 * start here: https://firebase.google.com/docs/database/security/quickstart
 *
 * For an api reference on how to define new rules, start here:
 * https://firebase.google.com/docs/database/security/securing-data
 */
export type UserAccess = ModelStub<'UserAccess'> & {|
  +alias: string,
  +canAddAccount: bool,
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
export type UserSession = ModelStub<'UserSession'> & {||};

/**
 * TODO: Add some documentation here.
 */
export type UserDebugLogs = ModelStub<'UserDebugLogs'> & {||};

/**
 * A users financial goal, serialized into a descriptive object. A financial
 * goal represents some goal set for / by the user, and is used to guide their
 * experience in the app. This includes the content that they see, the
 * recommendations they are given, etc...
 */
export type FinancialGoal = FinancialGoal$SaveForRetirement;

export type FinancialGoal$SaveForRetirement = ModelStub<'FinancialGoal'> & {|
  +goalType: 'SAVE_FOR_RETIREMENT',
|};

/**
 * A users credentials for plaid. These credentials allow a user to access
 * their plaid items given the relevant sandbox. Each credential is for a
 * specific plaid "item". Look here for plaid documentation on items:
 * https://plaid.com/docs/api/#retrieve-item
 *
 * NOTE: These credentials may expire relatively frequently and need to be
 * updated.
 */
export type PlaidCredentials = ModelStub<'PlaidCredentials'> & {|
  +accessToken: string,
  +environment: 'sandbox' | 'development' | 'production',
  +itemID: string,
  +metadata: Object,
|};
