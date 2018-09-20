/* @flow */

import FindiError from 'common/lib/FindiError';
import FindiService from '../FindiService';
import Firebase from 'react-native-firebase';
import UserInfo from 'common/lib/models/UserInfo';

import invariant from 'invariant';

import { requestBanner } from '../banner/Actions';

import type { AuthStatus } from './types';
import type {
  LoginCredentials,
  LoginPayload,
  SignUpForm,
} from 'common/lib/models/Auth';
import type { Next, PureAction, ReduxState, StoreType } from '../store';

const Auth = Firebase.auth();
const Firestore = Firebase.firestore();

export default class AuthMiddleware {
  _next: ?Next = null;
  _store: ?StoreType = null;

  _initialize(): void {
    Auth.onAuthStateChanged(this._onAuthStateChanged);
  }

  _handleAction(action: PureAction): void {
    this._dispatch(action);

    switch (action.type) {
      case 'LOGIN_REQUEST': {
        this._performLogin(action.loginCredentials);
        break;
      }

      case 'LOGOUT_REQUEST': {
        const { auth } = this._getState();
        const loginPayload = getLoginPayload(auth.status);
        invariant(
          loginPayload,
          'Requesting logout of a user that is not logged in',
        );
        this._performLogout(loginPayload);
        break;
      }

      case 'SIGN_UP_REQUEST': {
        this._performSignUp(action.signUpForm);
        break;
      }
    }
  }

  _onAuthStateChanged = async (): Promise<void> => {
    const { auth } = this._getState();
    const loginPayload = await genLoginPayload();

    if (canLogin(auth.status) && loginPayload) {
      FindiService.setLoginPayload(loginPayload);
      this._dispatch(changeLoginStatus({ loginPayload, type: 'LOGGED_IN' }));
    } else if (canLogout(auth.status) && !loginPayload) {
      FindiService.clearLoginPayload();
      this._dispatch(changeLoginStatus({ type: 'LOGGED_OUT' }));
    }
  };

  _performLogin(loginCredentials: LoginCredentials): void {
    // NOTE: Login auth state will automatically be detected in
    // "onAuthStateChanged"
    const { email, password } = loginCredentials;
    this._dispatch(
      changeLoginStatus({ loginCredentials, type: 'LOGIN_INITIALIZE' }),
    );
    Auth.signInAndRetrieveDataWithEmailAndPassword(email, password).catch(
      error => {
        // TODO: Error could be of different format. Need to perform error transform.
        this._dispatch(
          changeLoginStatus({ errorCode: error.code, type: 'LOGIN_FAILURE' }),
        );
      },
    );
  }

  _performLogout(loginPayload: LoginPayload): void {
    // NOTE: Login auth state will automatically be detected in
    // "onAuthStateChanged"
    this._dispatch(changeLoginStatus({ type: 'LOGOUT_INITIALIZE' }));
    Auth.signOut().catch(error => {
      // TODO: Error could be of different format. Need to perform error transform.
      this._dispatch({ errorCode: error.code, type: 'LOGOUT_FAILURE' });
    });
  }

  _performSignUp(signUpForm): void {
    this._genPerformSignUpImpl(signUpForm).catch(error => {
      const findiError = FindiError.fromUnknownEntity(error);
      const errorMessage = findiError.errorMessage;
      this._dispatch(
        changeLoginStatus({
          errorMessage,
          signUpForm,
          type: 'SIGN_UP_FAILURE',
        }),
      );
      this._dispatch(
        requestBanner({
          bannerChannel: 'SIGN_UP',
          bannerType: 'ALERT',
          id: 'SIGN_UP_REQUEST',
          priority: 'NORMAL',
          showSpinner: false,
          text: errorMessage,
        }),
      );
    });
  }

  async _genPerformSignUpImpl(signUpForm: SignUpForm): Promise<void> {
    this._dispatch(
      changeLoginStatus({ signUpForm, type: 'SIGN_UP_INITIALIZE' }),
    );
    this._dispatch(
      requestBanner({
        bannerChannel: 'SIGN_UP',
        bannerType: 'INFO',
        id: 'SIGN_UP_REQUEST',
        priority: 'NORMAL',
        showSpinner: true,
        text: 'Creating new user account...',
      }),
    );

    await FindiService.genCreateUser(signUpForm);

    const { email, password } = signUpForm;
    await Auth.signInAndRetrieveDataWithEmailAndPassword(email, password);
  }

  // ---------------------------------------------------------------------------
  //
  // BOILERPLATE
  //
  // ---------------------------------------------------------------------------
  _dispatch(action: PureAction): void {
    invariant(this._next, 'Expecting middleware to be initialized');
    this._next(action);
  }

  _getState(): ReduxState {
    invariant(this._store, 'Expecting middleware to be initialized');
    return this._store.getState();
  }

  handle = (store: StoreType) => (next: Next) => {
    this._store = store;
    this._next = next;
    this._initialize();

    return (action: PureAction) => {
      this._handleAction(action);
    };
  };
}

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

async function genUserInfo(id: string): Promise<UserInfo> {
  // TODO: Look into what errors this may return.
  // $FlowFixMe - Do not understand this flow error.
  const document = await Firestore.collection('UserInfo')
    .doc(id)
    .get();
  invariant(
    document.exists,
    'Data Error: UserInfo is missing for logged in user',
  );
  return UserInfo.fromRaw(document.data());
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

function changeLoginStatus(status: AuthStatus) {
  return { status, type: 'AUTH_STATUS_CHANGE' };
}
