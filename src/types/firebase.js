/* @flow */

// -----------------------------------------------------------------------------
//
// FIREBASE AUTH
//
// -----------------------------------------------------------------------------

// https://rnfirebase.io/docs/v3.1.*/auth/reference/auth#signInWithEmailAndPassword
export type Firebase$SignInErrorCode =
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password';

// TODO: Could not find documentation on firebase logout error codes, should
// investigate this further.
export type Firebase$SignOutErrorCode = 'auth/no-current-user' | string;

// TODO: Link Docs
export type PasswordResetInitializeErrorCode =
  | 'auth/invalid-email'
  | 'auth/user-not-found';

// TODO: Doc link
export type PasswordResetErrorCode =
  | 'auth/expired-action-code'
  | 'auth/invalid-action-code'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/week-password';

// https://rnfirebase.io/docs/v3.1.*/auth/reference/auth#createUserWithEmailAndPassword
// TODO: What happens if I create a user with an existing email? What error?
export type CreateUserErrorCode =
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password';

// TODO: Doc link
export type PendingVerificationErrorCode =
  | 'auth/expired-action-code'
  | 'auth/invalid-action-code'
  | 'auth/user-disabled'
  | 'auth/user-not-found';

// https://rnfirebase.io/docs/v3.1.*/auth/reference/auth#checkActionCode
export type CheckingVerificationErrorCode =
  | 'auth/expired-action-code'
  | 'auth/invalid-action-code'
  | 'auth/user-disabled'
  | 'auth/user-not-disabled';

// https://rnfirebase.io/docs/v3.1.*/auth/reference/AuthCredential
export type Firebase$AuthCredential = {|
  +providerId: string,
|};

// https://rnfirebase.io/docs/v3.1.*/auth/reference/UserInfo
export type Firebase$UserInfo = {|
  +displayName: ?string,

  +email: ?string,

  +phoneNumber: ?string,

  +photoURL: ?string,

  +providerId: string,

  +uid: string,
|};

// https://rnfirebase.io/docs/v3.1.*/auth/reference/User
export type Firebase$User = {|
  +delete: () => Promise<void>,

  +displayName: string,

  +email: string,

  +emailVerified: bool,

  +getIdToken: (forceRefresh?: bool) => Promise<string>,

  +isAnonymous: bool,

  +linkWithCredential: (
    credential: Firebase$AuthCredential,
  ) => Promise<Firebase$User>,

  +providerData: Array<Firebase$UserInfo>,

  +providerId: string,

  +reauthenticateWithCredential: (
    credential: Firebase$AuthCredential,
  ) => Promise<void>,

  +refreshToken: string,

  +reload: () => Promise<void>,

  +sendEmailVerification: () => Promise<void>,

  +toJSON: () => Object,

  +uid: string,

  +unlink: (providerID: string) => Promise<void>,

  +updateEmail: (newEmail: string) => Promise<void>,

  +updatePassword: (newPassword: string) => Promise<void>,
|};

// -----------------------------------------------------------------------------
//
// FIREBASE DATABASE
//
// -----------------------------------------------------------------------------

// https://rnfirebase.io/docs/v3.1.*/database/reference/DataSnapshot
export type Firebase$DataSnapshot = {|
  +child: (ref: Firebase$Reference) => Firebase$DataSnapshot,

  +exists: () => bool,

  +forEach: (
    callback: (childSnapshot: Firebase$DataSnapshot) => mixed,
  ) => bool,

  +getPriority: () => string | number | null,

  +hasChild: (path: string) => bool,

  +hasChildren: () => bool,

  +key: ?string,

  +numChildren: () => number,

  +ref: Firebase$Reference,

  +toJSON: () => Object,

  +val: () => any,
|};

// TODO: https://rnfirebase.io/docs/v3.1.*/database/reference/Reference
export type Firebase$Reference = Object;
