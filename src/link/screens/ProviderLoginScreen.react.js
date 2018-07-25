/* @flow */

import AccountLinkStateUtils from '../../data-model/state-utils/AccountLink';
import BannerManager from '../../components/shared/BannerManager.react';
import Content from '../../components/shared/Content.react';
import FooterWithButtons from '../../components/shared/FooterWithButtons.react';
import React, { Component } from 'react';
import Screen from '../../components/shared/Screen.react';
import YodleeLoginFormComponent from '../components/YodleeLoginForm.react';

import invariant from 'invariant';
import nullthrows from 'nullthrows';

import { ActivityIndicator, StyleSheet, View } from 'react-native';
import {
  calculateLoginFormCallToActionForProviderID,
  calculateCanSubmitLoginFormForProviderID,
} from '../utils';
import { connect } from 'react-redux';
import {
  submitLoginFormForProviderID,
  submitMFAFormForProviderID,
  updateLoginForm,
} from '../action';
import { NavBarHeight } from '../../design/layout';

import type Provider from 'common/lib/models/Provider';

import type { LoginForm as YodleeLoginForm } from 'common/types/yodlee-v1.0';
import type { ReduxProps } from '../../store';
import type { State as ReduxState } from '../../reducers/root';

export type Props = ReduxProps & ComputedProps & ComponentProps;

type ComponentProps = {};

type ComputedProps = {
  callToAction: string,
  canSubmit: boolean,
  formType: 'MFA' | 'LOGIN',
  isLoadingLoginForm: boolean,
  loginForm: YodleeLoginForm | null,
  provider: Provider | null,
};

class ProviderLoginScreen extends Component<Props> {
  render() {
    return (
      <Screen avoidNavBar={true}>
        <Content>
          {this._renderBanner()}
          <View style={styles.content}>
            {this.props.isLoadingLoginForm ? (
              <View style={styles.activityIndicatorContainer}>
                <ActivityIndicator size="small" />
              </View>
            ) : (
              <YodleeLoginFormComponent
                enableInteraction={true}
                loginForm={nullthrows(this.props.loginForm)}
                onChangeLoginForm={this._onChangeLoginForm}
              />
            )}
          </View>
        </Content>
        <FooterWithButtons
          buttonLayout={this._getFooterButtonLayout()}
          onPress={this._onFooterButtonPress}
        />
      </Screen>
    );
  }

  _renderBanner() {
    const { provider } = this.props;
    const channels = provider ? [`PROVIDERS/${provider.id}`] : [];
    return <BannerManager channels={channels} managerKey="BANER_MANAGER" />;
  }

  _onPressForgotPassword = (url: string): void => {
    // TODO: Open safari at the url.
    // https://facebook.github.io/react-native/docs/linking.html
  };

  _onChangeLoginForm = (loginForm: YodleeLoginForm): void => {
    const { provider } = this.props;
    invariant(provider, 'Cannot update login form when there is no provider');
    this.props.dispatch(updateLoginForm(provider.id, loginForm));
  };

  _onFooterButtonPress = (): void => {
    const { dispatch, formType, provider } = this.props;
    invariant(
      provider,
      'Cannot render non-exit button on ProviderLoginScreen when there is no provider',
    );
    if (formType === 'LOGIN') {
      dispatch(submitLoginFormForProviderID(provider.id));
    } else if (formType === 'MFA') {
      dispatch(submitMFAFormForProviderID(provider.id));
    }
  };

  _getFooterButtonLayout() {
    // TODO: Should have a way to disable back button in the nav bar.
    const { callToAction, canSubmit } = this.props;
    return {
      centerButtonText: callToAction,
      isCenterButtonDisabled: !canSubmit,
      type: 'CENTER',
    };
  }
}

function mapReduxStateToProps(reduxState: ReduxState): ComputedProps {
  const { page } = reduxState.accountVerification;
  invariant(
    page && page.type === 'LOGIN',
    'Login page showing when page is not type login: %s',
    page && page.type,
  );
  const { providerID } = page;
  const loginForm =
    reduxState.accountVerification.loginFormContainer[providerID] || null;
  const accountLink = AccountLinkStateUtils.findModel(
    reduxState,
    accountLink => accountLink.providerRef.refID === providerID,
  );
  // TODO: Properly handle provider loading failure.
  invariant(
    loginForm ||
      reduxState.providerFuzzySearch.status === 'EMPTY' ||
      reduxState.providerFuzzySearch.status === 'LOADING',
    'Expecting login form to either be loading or to exist for providerID: %s',
    providerID,
  );
  const callToAction = loginForm
    ? calculateLoginFormCallToActionForProviderID(reduxState, providerID)
    : 'LOGIN';
  const canSubmit = loginForm
    ? calculateCanSubmitLoginFormForProviderID(reduxState, providerID)
    : false;
  const isLoadingLoginForm = Boolean(
    !loginForm ||
      (accountLink && accountLink.status === 'MFA / WAITING_FOR_LOGIN_FORM'),
  );

  const formType = accountLink && accountLink.isInMFA ? 'MFA' : 'LOGIN';
  const provider =
    reduxState.providerFuzzySearch.orderedCollection.get(providerID) || null;

  return {
    callToAction,
    canSubmit,
    formType,
    isLoadingLoginForm,
    loginForm,
    provider,
  };
}

export default connect(mapReduxStateToProps)(ProviderLoginScreen);

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    marginTop: 32,
  },

  content: {
    flex: 1,
  },

  loginHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: NavBarHeight,
  },
});
