/* @flow */

import Backend from '../../backend';

import invariant from 'invariant';

import { ReduxMiddleware } from '../../common/redux-utils';

import type { Action$SubmitYodleeLoginFormInitialize } from '../action';
import type { LoginForm as YodleeLoginForm } from 'common/types/yodlee-v1.0';
import type { PureAction, ReduxState } from '../../store';

type State = {|
  +submitFormAction: Action$SubmitYodleeLoginFormInitialize | null,
  +submittedLoginForm: YodleeLoginForm | null,
|};

export default class ProviderLoginMiddleware extends ReduxMiddleware<State> {
  static __calculateInitialState = () => ({
    submitFormAction: null,
    submittedLoginForm: null,
  });

  static __calculateStatePreAction = (
    reduxState: ReduxState,
    _2: *,
    action: PureAction,
  ): State => {
    // NOTE: We are updating the state pre-action since we know that at the
    // time this action is sent, we have a valid login form ready to submit.
    if (action.type === 'SUBMIT_YODLEE_LOGIN_FORM_INITIALIZE') {
      const submittedLoginForm =
        reduxState.accountVerification.loginFormContainer[action.providerID];
      return {
        submitFormAction: action,
        submittedLoginForm,
      };
    }

    return { submitFormAction: null, submittedLoginForm: null };
  };

  __didUpdateState = async (state: State): Promise<void> => {
    if (!state.submitFormAction) {
      return;
    }

    const { submitFormAction, submittedLoginForm } = state;
    const { operationID, providerID } = submitFormAction;

    invariant(
      submittedLoginForm,
      'Expecting login form to exist for provider: %s',
      providerID,
    );

    try {
      await Backend.genYodleeSubmitProviderLoginForm(
        providerID,
        submittedLoginForm,
      );
      this.__dispatch({
        operationID,
        providerID,
        type: 'SUBMIT_YODLEE_LOGIN_FORM_SUCCESS',
      });
    } catch (error) {
      this.__dispatch({
        error,
        operationID,
        providerID,
        type: 'SUBMIT_YODLEE_LOGIN_FORM_FAILURE',
      });
    }
  };
}
