/* @flow */

import BannerManager from '../../components/shared/BannerManager.react';
import Colors from '../../design/colors';
import Content from '../../components/shared/Content.react';
import FooterWithButtons from '../../components/shared/FooterWithButtons.react';
import Icons from '../../design/icons';
import React, { Component } from 'react';
import Screen from '../../components/shared/Screen.react';
import TextDesign from '../../design/text';
import YodleeLoginFormComponent from './YodleeLoginForm.react';

import invariant from 'invariant';

import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import {
  exitAccountVerification,
  requestProviderSearch,
  submitYodleeLoginFormForProviderID,
  updateLoginForm,
} from '../action';
import { getAccountLinkForProviderID } from '../../common/state-utils';
import {
  isInMFA,
  isLinkFailure,
  isLinkSuccess,
} from 'common/lib/models/AccountLink';
import { NavBarHeight } from '../../design/layout';

import type { LoginForm as YodleeLoginForm } from 'common/types/yodlee';
import type { Provider } from 'common/lib/models/Provider';
import type { ReduxProps } from '../../typesDEPRECATED/redux';
import type { State as ReduxState } from '../../reducers/root';

export type Props = ReduxProps & ComputedProps & ComponentProps;

type ComponentProps = {};

type ComputedProps = {
  callToAction: string,
  canSubmit: boolean,
  enableInteraction: boolean,
  isLoadingLoginForm: boolean,
  loginForm: YodleeLoginForm,
  provider: Provider,
};

const LEFT_ARROW_WIDTH = 18;

class AccountLoginScreen extends Component<Props> {
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
                loginForm={this.props.loginForm}
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
      provider.sourceOfTruth.type === 'YODLEE',
      'Expecting provider to come from YODLEE',
    );
    const yodleeProvider = provider.sourceOfTruth.value;

    return (
      <View style={styles.loginHeader}>
        <TouchableOpacity onPress={this._onPressBack}>
          <Image
            resizeMode="contain"
            source={Icons.LeftArrow}
            style={styles.headerLeftIcon}
          />
        </TouchableOpacity>
        <Text style={[TextDesign.header3, styles.headerTitle]}>
          {yodleeProvider.name}
        </Text>
        <View style={styles.headerRightIcon} />
      </View>
    );
  }

  _renderBanner() {
    const channels = [`PROVIDERS/${this.props.provider.id}`];
    return <BannerManager channels={channels} managerKey="BANER_MANAGER" />;
  }

  _onPressBack = (): void => {
    this.props.dispatch(requestProviderSearch());
  };

  _onPressForgotPassword = (url: string): void => {
    // TODO: Open safari at the url.
    // https://facebook.github.io/react-native/docs/linking.html
  };

  _onChangeLoginForm = (loginForm: YodleeLoginForm): void => {
    this.props.dispatch(updateLoginForm(this.props.provider.id, loginForm));
  };

  _onFooterButtonPress = (button: 'LEFT' | 'RIGHT' | 'CENTER'): void => {
    if (this._isCancelButton(button)) {
      this.props.dispatch(exitAccountVerification());
      return;
    }
    const { provider } = this.props;
    this.props.dispatch(submitYodleeLoginFormForProviderID(provider.id));
  };

  _getFooterButtonLayout() {
    const { callToAction, canSubmit, enableInteraction } = this.props;
    invariant(
      callToAction,
      'Expecting call to action to exist when page is type LOGIN',
    );
    return {
      isLeftButtonDisabled: !enableInteraction,
      isRightButtonDisabled: !enableInteraction || !canSubmit,
      leftButtonText: 'EXIT',
      rightButtonText: callToAction,
      type: 'LEFT_AND_RIGHT',
    };
  }

  _isCancelButton(button: 'LEFT' | 'RIGHT' | 'CENTER') {
    return button === 'CENTER' || button === 'LEFT';
  }
}

function calculateCallToActionForLoginForm(loginForm: YodleeLoginForm): string {
  return loginForm.formType === 'login' ? 'LOGIN' : 'SUBMIT';
}

function calculateIsFormFilledOut(loginForm: YodleeLoginForm): boolean {
  for (const row of loginForm.row) {
    for (const field of row.field) {
      if (!field.isOptional && field.value.length === 0) {
        return false;
      }
    }
  }
  return true;
}

function mapReduxStateToProps(state: ReduxState): ComputedProps {
  const { page } = state.accountVerification;
  invariant(
    page && page.type === 'LOGIN',
    'Login page showing when page is not type login: %s',
    page && page.type,
  );
  const { providerID } = page;
  const { providerPendingLoginID } = state.accountVerification;
  const loginForm = state.accountVerification.loginFormContainer[providerID];
  const accountLink = getAccountLinkForProviderID(state, providerID);
  invariant(
    loginForm,
    'Expecting login form to exist for providerID',
    providerID,
  );
  const isFilledOut = calculateIsFormFilledOut(loginForm);
  const callToAction = calculateCallToActionForLoginForm(loginForm);
  const canSubmit =
    providerID !== providerPendingLoginID &&
    Boolean(loginForm && isFilledOut) &&
    (!accountLink ||
      isLinkSuccess(accountLink) ||
      isLinkFailure(accountLink) ||
      accountLink.status === 'MFA / PENDING_USER_INPUT');
  const isLoadingLoginForm = Boolean(
    accountLink && accountLink.status === 'MFA / WAITING_FOR_LOGIN_FORM',
  );
  const enableInteraction =
    state.accountVerification.providerPendingLoginID !== providerID &&
    (!accountLink || !isInMFA(accountLink));

  return {
    canSubmit,
    callToAction,
    enableInteraction,
    isLoadingLoginForm,
    loginForm,
    provider: state.providers.container[providerID],
  };
}

export default connect(mapReduxStateToProps)(AccountLoginScreen);

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
    borderColor: Colors.BORDER_HAIRLINE,
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
