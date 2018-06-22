/* @flow */

import BannerManager from '../../components/shared/BannerManager.react';
import Content from '../../components/shared/Content.react';
import DataModelStateUtils from '../../data-model/state-utils';
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
import { submitYodleeLoginFormForProviderID, updateLoginForm } from '../action';
import { NavBarHeight } from '../../design/layout';

import type Provider from 'common/lib/models/Provider';

import type { LoginForm as YodleeLoginForm } from 'common/types/yodlee-v1.0';
import type { ReduxProps } from '../../store';
import type { State as ReduxState } from '../../reducers/root';

export type Props = ReduxProps & ComputedProps & ComponentProps;

type ComponentProps = {};

type ComputedProps = {
  callToAction: string,
  canExit: boolean,
  canSubmit: boolean,
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
    const { provider } = this.props;
    invariant(
      provider,
      'Cannot render non-exit button on ProviderLoginScreen when there is no provider',
    );
    this.props.dispatch(submitYodleeLoginFormForProviderID(provider.id));
  };

  _getFooterButtonLayout() {
    // TODO: Should have a way to disable back button in the nav bar.
    const { callToAction, canExit, canSubmit } = this.props;
    return {
      centerButtonText: callToAction,
      isCenterButtonDisabled: !canSubmit,
      type: 'CENTER',
    };
  }
}

function mapReduxStateToProps(state: ReduxState): ComputedProps {
  const { page } = state.accountVerification;
  invariant(
    page && page.type === 'LOGIN',
    'Login page showing when page is not type login: %s',
    page && page.type,
  );
  const { providerID } = page;
  const loginForm =
    state.accountVerification.loginFormContainer[providerID] || null;
  const accountLink = DataModelStateUtils.getAccountLinkForProviderID(
    state,
    providerID,
  );
  // TODO: Properly handle provider loading failure.
  invariant(
    loginForm ||
      state.providers.status === 'EMPTY' ||
      state.providers.status === 'LOADING',
    'Expecting login form to either be loading or to exist for providerID: %s',
    providerID,
  );
  const callToAction = loginForm
    ? calculateLoginFormCallToActionForProviderID(state, providerID)
    : 'LOGIN';
  const canSubmit = loginForm
    ? calculateCanSubmitLoginFormForProviderID(state, providerID)
    : false;
  const isLoadingLoginForm = Boolean(
    !loginForm ||
      (accountLink && accountLink.status === 'MFA / WAITING_FOR_LOGIN_FORM'),
  );
  const pendingLoginRequest =
    state.accountVerification.providerPendingLoginRequestMap[providerID];
  const canExit =
    !pendingLoginRequest && (!accountLink || !accountLink.isInMFA);

  return {
    callToAction,
    canExit,
    canSubmit,
    isLoadingLoginForm,
    loginForm,
    provider: state.providers.container[providerID],
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
