/* @flow */

/**
 * Authentication Credentials as defined by firebase. For the full
 * documentation, please look here:
 */
// https://rnfirebase.io/docs/v3.1.*/auth/reference/AuthCredential
export type Firebase$AuthCredential = {|
  +providerId: string,
|};

/**
 * User Info as defined by firebase. For the full documentation, please look
 * here:
 */
// https://rnfirebase.io/docs/v3.1.*/auth/reference/UserInfo
export type Firebase$UserInfo = {|
  +displayName: ?string,

  +email: ?string,

  +phoneNumber: ?string,

  +photoURL: ?string,

  +providerId: string,

  +uid: string,
|};

/**
 * A User, as defined by Firebase, for full documentation please look here:
 */
// https://rnfirebase.io/docs/v3.1.*/auth/reference/User
export type Firebase$User = {|
  +delete: () => Promise<void>,

  +displayName: string,

  +email: string,

  +emailVerified: bool,

  +getIdToken: (forceRefresh: bool) => Promise<string>,

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

// TODO: https://rnfirebase.io/docs/v3.1.*/database/reference/Reference
export type Firebase$Reference = Object;

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
