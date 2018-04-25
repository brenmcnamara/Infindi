/* @flow */

import BannerManager from '../../components/shared/BannerManager.react';
import Content from '../../components/shared/Content.react';
import DataModelStateUtils from '../../data-model/state-utils';
import FooterWithButtons from '../../components/shared/FooterWithButtons.react';
import Icons from '../../design/icons';
import React, { Component } from 'react';
import Screen from '../../components/shared/Screen.react';
import YodleeLoginFormComponent from './YodleeLoginForm.react';

import invariant from 'invariant';
import nullthrows from 'nullthrows';

import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  calculateLoginFormCallToActionForProviderID,
  calculateCanSubmitLoginFormForProviderID,
} from '../utils';
import { connect } from 'react-redux';
import {
  exitAccountVerification,
  requestProviderSearch,
  submitYodleeLoginFormForProviderID,
  updateLoginForm,
} from '../action';
import { GetTheme } from '../../design/components/Theme.react';
import { isInMFA } from 'common/lib/models/AccountLink';
import { NavBarHeight } from '../../design/layout';

import type { LoginForm as YodleeLoginForm } from 'common/types/yodlee';
import type { Provider } from 'common/lib/models/Provider';
import type { ReduxProps } from '../../store';
import type { State as ReduxState } from '../../reducers/root';

export type Props = ReduxProps & ComputedProps & ComponentProps;

type ComponentProps = {
  enableInteraction: boolean,
};

type ComputedProps = {
  callToAction: string | null,
  canExit: boolean,
  canSubmit: boolean,
  isLoadingLoginForm: boolean,
  loginForm: YodleeLoginForm | null,
  provider: Provider | null,
};

const LEFT_ARROW_WIDTH = 18;

class ProviderLoginScreen extends Component<Props> {
  render() {
    return (
      <Screen>
        <Content>
          {this._renderHeader()}
          {this._renderBanner()}
          <View style={styles.content}>
            {this.props.isLoadingLoginForm ? (
              <View style={styles.activityIndicatorContainer}>
                <ActivityIndicator size="small" />
              </View>
            ) : (
              <YodleeLoginFormComponent
                enableInteraction={this.props.enableInteraction}
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

  _renderHeader() {
    const { provider } = this.props;
    invariant(
      !provider || provider.sourceOfTruth.type === 'YODLEE',
      'Expecting provider to come from YODLEE',
    );
    // Move this functionality to 'common'.
    const providerName = provider ? provider.sourceOfTruth.value.name : '';

    return (
      <GetTheme>
        {theme => (
          <View
            style={[
              styles.loginHeader,
              { borderColor: theme.color.borderHairline },
            ]}
          >
            {this._renderBackButton()}
            <Text style={[theme.getTextStyleHeader3(), styles.headerTitle]}>
              {providerName}
            </Text>
            <View style={styles.headerRightIcon} />
          </View>
        )}
      </GetTheme>
    );
  }

  _renderBanner() {
    const { provider } = this.props;
    const channels = provider ? [`PROVIDERS/${provider.id}`] : [];
    return <BannerManager channels={channels} managerKey="BANER_MANAGER" />;
  }

  _renderBackButton() {
    const canGoBack = this.props.enableInteraction && this.props.canExit;
    const content = (
      <Image
        resizeMode="contain"
        source={Icons.LeftArrow}
        style={[styles.headerLeftIcon, canGoBack ? null : { opacity: 0.3 }]}
      />
    );
    if (canGoBack) {
      return (
        <TouchableOpacity onPress={this._onPressBack}>
          {content}
        </TouchableOpacity>
      );
    }
    return content;
  }

  _onPressBack = (): void => {
    invariant(
      this.props.enableInteraction && this.props.canExit,
      'Trying to process back button when it should be disabled',
    );
    this.props.dispatch(requestProviderSearch());
  };

  _onPressForgotPassword = (url: string): void => {
    // TODO: Open safari at the url.
    // https://facebook.github.io/react-native/docs/linking.html
  };

  _onChangeLoginForm = (loginForm: YodleeLoginForm): void => {
    const { provider } = this.props;
    invariant(provider, 'Cannot update login form when there is no provider');
    this.props.dispatch(updateLoginForm(provider.id, loginForm));
  };

  _onFooterButtonPress = (button: 'LEFT' | 'RIGHT' | 'CENTER'): void => {
    if (this._isExitButton(button)) {
      this.props.dispatch(exitAccountVerification());
      return;
    }
    const { provider } = this.props;
    invariant(
      provider,
      'Cannot render non-exit button on ProviderLoginScreen when there is no provider',
    );
    this.props.dispatch(submitYodleeLoginFormForProviderID(provider.id));
  };

  _getFooterButtonLayout() {
    const { callToAction, canExit, canSubmit, enableInteraction } = this.props;
    if (!callToAction) {
      return {
        centerButtonText: 'EXIT',
        isCenterButtonDisabled: !enableInteraction || !canExit,
        type: 'CENTER',
      };
    }

    return {
      isLeftButtonDisabled: !enableInteraction || !canExit,
      isRightButtonDisabled: !enableInteraction || !canSubmit,
      leftButtonText: 'EXIT',
      rightButtonText: callToAction,
      type: 'LEFT_AND_RIGHT',
    };
  }

  _isExitButton(button: 'LEFT' | 'RIGHT' | 'CENTER') {
    return button === 'CENTER' || button === 'LEFT';
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
  invariant(
    loginForm ||
      state.providers.status === 'EMPTY' ||
      state.providers.status === 'LOADING',
    'Expecting login form to either be loading or to exist for providerID: %s',
    providerID,
  );
  const callToAction = loginForm
    ? calculateLoginFormCallToActionForProviderID(state, providerID)
    : null;
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
    !pendingLoginRequest && (!accountLink || !isInMFA(accountLink));

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

  headerLeftIcon: {
    marginLeft: 16,
    width: LEFT_ARROW_WIDTH,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },

  headerRightIcon: {
    marginRight: 16,
    width: LEFT_ARROW_WIDTH,
  },
});
