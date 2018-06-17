/* @flow */

import Backend from '../backend';
import Firebase from 'react-native-firebase';

import invariant from 'invariant';

import { dismissToast, requestToast } from '../actions/toast';

import type { AuthStatus } from './types';
import type { Next, PureAction, StoreType } from '../store';
import type { User as FirebaseUser } from 'common/types/firebase';
import type {
  LoginCredentials,
  LoginPayload,
  SignUpForm,
} from 'common/lib/models/Auth';
import type { UserInfoRaw } from 'common/lib/models/UserInfo';

const Auth = Firebase.auth();
const Database = Firebase.firestore();

type ChangeStatus = (auth: AuthStatus) => *;

// -----------------------------------------------------------------------------
//
// AUTHENTICATION MIDDLEWARE
//
// -----------------------------------------------------------------------------

export default (store: StoreType) => (next: Next) => {
  // Convenience function.
  const changeStatus = (status: AuthStatus) => {
    return next({ type: 'AUTH_STATUS_CHANGE', status });
  };
  // Listen to firebase changes for authentication and
  // generate the relevant actions.
  Auth.onAuthStateChanged(async () => {
    const { auth } = store.getState();
    const loginPayload: ?LoginPayload = await genLoginPayload();

    if (canLogin(auth.status) && loginPayload) {
      Backend.setLoginPayload(loginPayload);
      changeStatus({ loginPayload, type: 'LOGGED_IN' });
    } else if (canLogout(auth.status) && !loginPayload) {
      Backend.clearLoginPayload();
      changeStatus({ type: 'LOGGED_OUT' });
    }
  });

  // Handle the stream of actions that are coming in. Watch for any
  // authentication-related actions that require some authentication trigger
  // to get called.
  return (action: PureAction) => {
    next(action);

    switch (action.type) {
      case 'LOGIN_REQUEST': {
        const { loginCredentials } = action;
        genPerformLogin(loginCredentials, changeStatus);
        break;
      }

      case 'LOGOUT_REQUEST': {
        const { auth } = store.getState();
        const loginPayload = getLoginPayload(auth.status);
        invariant(
          loginPayload,
          'Requesting logout of a user that is not logged in',
        );
        genPerformLogout(loginPayload, changeStatus);
        break;
      }

      case 'SIGN_UP_REQUEST': {
        genPerformSignUp(changeStatus, next, action.signUpForm);
        break;
      }
    }
  };
};

// -----------------------------------------------------------------------------
//
// SIDE EFFECT TRIGGERS
//
// -----------------------------------------------------------------------------

function genPerformLogin(
  loginCredentials: LoginCredentials,
  changeStatus: ChangeStatus,
) {
  const promise = new Promise(resolve => {
    changeStatus({ loginCredentials, type: 'LOGIN_INITIALIZE' });
    resolve();
  });
  return promise
    .then(() => {
      const { email, password } = loginCredentials;
      return Auth.signInAndRetrieveDataWithEmailAndPassword(email, password);
    })
    .catch(error => {
      // TODO: Error could be of different format. Need to perform error transform.
      changeStatus({ errorCode: error.code, type: 'LOGIN_FAILURE' });
    });
}

function genPerformLogout(
  loginPayload: LoginPayload,
  changeStatus: ChangeStatus,
): Promise<void> {
  // NOTE: Login auth state will automatically be detected in
  // "onAuthStateChanged" from above.
  const promise = new Promise(resolve => {
    changeStatus({ type: 'LOGOUT_INITIALIZE' });
    resolve();
  });
  return promise
    .then(() => {
      return Auth.signOut();
    })
    .catch(error => {
      // TODO: Error could be of different format. Need to perform error transform.
      changeStatus({ errorCode: error.code, type: 'LOGOUT_FAILURE' });
    });
}

function genPerformSignUp(
  changeStatus: ChangeStatus,
  next: Next,
  signUpForm: SignUpForm,
): Promise<void> {
  return Promise.resolve()
    .then(() => {
      changeStatus({ signUpForm, type: 'SIGN_UP_INITIALIZE' });
      next(
        dismissToast(
          'SIGN_UP_REQUEST_ERROR',
          /* shouldThrowOnDismissingNonExistantToast */ false,
        ),
      );
      return Backend.genCreateUser(signUpForm);
    })
    .then(() => {
      const { email, password } = signUpForm;
      return Auth.signInAndRetrieveDataWithEmailAndPassword(email, password);
    })
    .catch(error => {
      const errorMessage = error.errorMessage || error.toString();
      changeStatus({ errorMessage, signUpForm, type: 'SIGN_UP_FAILURE' });
      next(
        requestToast({
          bannerChannel: 'SIGN_UP',
          bannerType: 'ALERT',
          id: 'SIGN_UP_REQUEST_ERROR',
          priority: 'NORMAL',
          showSpinner: false,
          text: errorMessage,
          toastType: 'BANNER',
        }),
      );
    });
}

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

async function genUserInfo(id: string): Promise<UserInfoRaw> {
  // TODO: Look into what errors this may return.
  // $FlowFixMe - Do not understand this flow error.
  const document = await Database.collection('UserInfo')
    .doc(id)
    .get();
  invariant(
    document.exists,
    'Data Error: UserInfo is missing for logged in user',
  );
  const userInfo: UserInfoRaw = document.data();
  return userInfo;
}

async function genLoginPayload(): Promise<?LoginPayload> {
  // $FlowFixMe - This is fine.
  const firebaseUser: FirebaseUser = Auth.currentUser;
  if (!firebaseUser) {
    return null;
  }
  const [userInfo, idToken] = await Promise.all([
    genUserInfo(firebaseUser.uid),
    firebaseUser.getIdToken(),
  ]);
  return { firebaseUser, idToken, userInfo };
}

function getLoginPayload(auth: AuthStatus): ?LoginPayload {
  switch (auth.type) {
    case 'LOGGED_IN':
      return auth.loginPayload;
    default:
      return null;
  }
}

function canLogin(auth: AuthStatus): boolean {
  return (
    auth.type === 'NOT_INITIALIZED' ||
    auth.type === 'LOGIN_INITIALIZE' ||
    auth.type === 'SIGN_UP_INITIALIZE'
  );
}

function canLogout(auth: AuthStatus): boolean {
  return auth.type === 'NOT_INITIALIZED' || auth.type === 'LOGOUT_INITIALIZE';
}
