/* @flow */

import Backend from '../../backend';

import invariant from 'invariant';

import { ReduxMiddleware } from '../../common/redux-utils';

import type {
  Action$SubmitLoginFormInitialize,
  Action$SubmitMFAFormInitialize,
} from '../action';
import type { LoginForm as YodleeLoginForm } from 'common/types/yodlee-v1.0';
import type { PureAction, ReduxState } from '../../store';

type State = {|
  formType: null | 'MFA' | 'LOGIN',
  // eslint-disable-next-line flowtype/space-after-type-colon
  +submitFormAction:
    | Action$SubmitLoginFormInitialize
    | Action$SubmitMFAFormInitialize
    | null,
  +submittedLoginForm: YodleeLoginForm | null,
|};

export default class ProviderLoginMiddleware extends ReduxMiddleware<State> {
  static __calculateInitialState = () => ({
    formType: null,
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
    if (
      action.type === 'SUBMIT_LOGIN_FORM_INITIALIZE' ||
      action.type === 'SUBMIT_MFA_FORM_INITIALIZE'
    ) {
      const submittedLoginForm =
        reduxState.accountVerification.loginFormContainer[action.providerID];
      const formType =
        action.type === 'SUBMIT_LOGIN_FORM_INITIALIZE' ? 'LOGIN' : 'MFA';
      return {
        formType,
        submitFormAction: action,
        submittedLoginForm,
      };
    }

    return {
      formType: null,
      submitFormAction: null,
      submittedLoginForm: null,
    };
  };

  __didUpdateState = async (state: State): Promise<void> => {
    if (!state.submitFormAction) {
      return;
    }

    const { formType, submitFormAction, submittedLoginForm } = state;
    const { operationID, providerID } = submitFormAction;

    invariant(
      formType,
      'Expecting from type to be defined during provider form submission',
    );
    invariant(
      submittedLoginForm,
      'Expecting login form to exist for provider: %s',
      providerID,
    );

    try {
      if (formType === 'LOGIN') {
        await Backend.genSubmitProviderLoginForm(
          providerID,
          submittedLoginForm,
        );
      } else {
        await Backend.genSubmitProviderMFAForm(providerID, submittedLoginForm);
      }
      this.__dispatch({
        operationID,
        providerID,
        type: 'SUBMIT_LOGIN_FORM_SUCCESS',
      });
    } catch (error) {
      this.__dispatch({
        error,
        operationID,
        providerID,
        type: 'SUBMIT_LOGIN_FORM_FAILURE',
      });
    }
  };
}
