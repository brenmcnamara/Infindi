/* @flow */

import type {
  Dollars,
  Fuzzy,
  ID,
  Location,
  ModelStub,
  Pointer,
  Seconds,
  YearMonthDay,
} from './core';
import type { Firebase$User } from './firebase';
import type {
  Account as Plaid$Account,
  Transaction as Plaid$Transaction,
} from './plaid';

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
  +userMetrics: UserMetrics,
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
|};

/**
 * This model contains data related to important metrics that we are tracking
 * for the current user. These metrics are all related to the users finances
 * and are mostly calculated from the more concrete information the user
 * provides, such as accounts and transactions.
 */
export type UserMetrics = ModelStub<'UserMetric'> & {
  +netWorth: Dollars | null,
  +savingsRate: Dollars | null,
};

/**
 * This is a detailed object containing the permissions that a partcilar
 * user has. Once created, this cannot be mutated, except through some
 * priveledges process run by an admin.
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
export type PlaidCredentials = ModelStub<'PlaidCredentials'> & {
  +accessToken: string,
  +environment: 'sandbox' | 'development' | 'production',
  +itemID: string,
  +metadata: Object,
  +userRef: Pointer<'User'>,
};

/**
 * PlaidItemDownloadRequest contains all the metadata in charge of tracking
 * plaid downloads for items. Each download request tracks the download of a
 * plaid credentials object. There can be at most 1 plaid download running at
 * a time per plaid credential, though there can be many interrupted or failed
 * downloads existing.
 */
export type PlaidDownloadStatus =
  | {|
      +type: 'NOT_INITIALIZED',
    |}
  | {|
      +claim: PlaidDownloadClaim,
      +type: 'IN_PROGRESS',
    |}
  | {|
      +totalDownloadTime: Seconds,
      +type: 'COMPLETE',
    |}
  | {|
      +lastClaim: PlaidDownloadClaim,
      +type: 'CANCELED',
    |}
  | {|
      +errorCode: string,
      +errorMessage: string,
      +type: 'FAILURE',
    |};

/**
 * When a worker wants to claim a download request to work on, it needs to
 * submit a claim transaction to tell other workers not to try to work on this
 * request.
 *
 * It could be the case that a worker is killed before it can complete a task.
 * In order to prevent download requests from being left behind as a result of
 * this, each claim needs to include a timeout before the worker is required
 * to update the claim. The timeout and start time of the claim must be
 * specified.
 */
export type PlaidDownloadClaim = {|
  +createdAt: Date,
  +timeout: Seconds,
  +updatedAt: Date,
  +workerID: ID,
|};

export type PlaidDownloadRequest = ModelStub<'PlaidDownloadRequest'> & {
  +credentialsRef: Pointer<'PlaidCredentials'>,
  +status: PlaidDownloadStatus,
  +userRef: Pointer<'User'>,
};

/**
 * Represents the bank account of a user.
 */
export type Account = ModelStub<'Account'> & {
  +alias: ?number,
  +balance: Dollars,
  +name: string,
  +sourceOfTruth: {|
    +type: 'PLAID',
    +value: Plaid$Account,
  |},
  +userRef: Pointer<'User'>,
};

/**
 * A bank transaction
 */
export type Transaction = ModelStub<'Transaction'> & {
  +accountRef: Pointer<'Account'>,
  +amount: Dollars,
  +category: ?string,
  +name: string,
  +sourceOfTruth: {|
    +type: 'PLAID',
    +value: Plaid$Transaction,
  |},
  +transactionDate: Date,
  +userRef: Pointer<'User'>,
};
