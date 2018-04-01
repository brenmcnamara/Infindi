/* @flow */

import AccountLogin from './AccountLogin.react';
import BannerManager from '../../components/shared/BannerManager.react';
import Colors from '../../design/colors';
import Content from '../../components/shared/Content.react';
import FooterWithButtons from '../../components/shared/FooterWithButtons.react';
import Icons from '../../design/icons';
import ProviderSearch from './ProviderSearch.react';
import React, { Component } from 'react';
import Screen from '../../components/shared/Screen.react';
import TextDesign from '../../design/text';

import invariant from 'invariant';

import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import {
  dismissAccountVerification,
  requestProviderLogin,
  unsupportedProvider,
  updateLoginForm,
} from '../action';
import { fetchProviders } from '../../data-model/actions/providers';
import { isSupportedProvider } from '../utils';
import { getAccountLinkContainer } from '../../common/state-utils';
import { NavBarHeight } from '../../design/layout';
import { ProviderSearchError } from '../../../content';

import type { AccountLink } from 'common/lib/models/AccountLink';
import type { ComponentType } from 'react';
import type { ID } from 'common/types/core';
import type { LoginForm as YodleeLoginForm } from 'common/types/yodlee';
import type { LoginFormContainer } from '../../link/types';
import type { ModelContainer } from '../../datastore';
import type { Provider } from 'common/lib/models/Provider';
import type { ProviderFetchStatus } from '../../data-model/types';
import type { ReduxProps } from '../../typesDEPRECATED/redux';
import type { State as ReduxState } from '../../reducers/root';
import type { TransitionStage } from '../../reducers/modalState';

export type ComponentProps = {
  transitionStage: TransitionStage,
};

export type ComputedProps = {
  accountLinkContainer: AccountLinkContainer,
  loginForms: LoginFormContainer,
  providerFetchStatus: ProviderFetchStatus,
  providerPendingLoginID: ID | null,
  providers: Array<Provider>,
};

export type Props = ReduxProps & ComputedProps & ComponentProps;

type AccountLinkContainer = ModelContainer<'AccountLink', AccountLink>;

type Inset = {|
  +bottom: number,
  +left: number,
  +right: number,
  +top: number,
|};

type Page =
  | {|
      +search: string,
      +type: 'SEARCH_ERROR',
    |}
  | {|
      +providers: Array<Provider>,
      +search: string,
      +type: 'SEARCH',
    |}
  | {|
      +providers: Array<Provider>,
      +search: string,
      +selectedProvider: Provider,
      +type: 'LOGIN',
    |};

type PageTransition =
  | {|
      +fromPage: Page,
      +toPage: Page,
      +type: 'TRANSITIONING',
    |}
  | {|
      +page: Page,
      +type: 'NOT_TRANSITIONING',
    |};

type State = {
  activeTransition: 'A' | 'B',
  didCompleteInitialSearch: bool,
  pageTransition: PageTransition,
  safeAreaInset: Inset,
};

// TODO: BUG: Click on Add Account / Cancel many times really fast to get
// modal view to throw an error.
export const TransitionInMillis = 400;
export const TransitionOutMillis = 400;

const LEFT_ARROW_WIDTH = 18;
const INSET_DEFAULT = { bottom: 0, left: 0, right: 0, top: 20 };

class AccountVerification extends Component<Props, State> {
  _pageTransitionA: Animated.Value;
  _pageTransitionB: Animated.Value;

  constructor(props: Props) {
    super(props);
    this._pageTransitionA = new Animated.Value(
      props.transitionStage === 'IN' ? 1.0 : 0.0,
    );
    this._pageTransitionB = new Animated.Value(0.0);

    const page =
      props.providerFetchStatus === 'FAILURE'
        ? {
            search: '',
            type: 'SEARCH_ERROR',
          }
        : {
            providers: props.providers,
            search: '',
            type: 'SEARCH',
          };

    this.state = {
      activeTransition: 'A',
      didCompleteInitialSearch: false,
      pageTransition: { page, type: 'NOT_TRANSITIONING' },
      safeAreaInset: isIphoneX()
        ? { bottom: 20, left: 0, right: 0, top: 44 }
        : INSET_DEFAULT,
    };
  }

  componentWillMount(): void {
    Keyboard.addListener('keyboardWillShow', this._onKeyboardWillShow);
    Keyboard.addListener('keyboardWillHide', this._onKeyboardWillHide);
  }

  componentDidMount(): void {
    // Start initial search.
    const page = this._getCurrentPage();
    const search = page.type === 'SEARCH' ? page.search : '';
    this.props.dispatch(fetchProviders(search));
  }

  componentWillUnmount(): void {
    Keyboard.removeListener('keyboardWillShow', this._onKeyboardWillShow);
    Keyboard.removeListener('keyboardWillHide', this._onKeyboardWillHide);
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (
      this.props.providerFetchStatus === 'LOADING' &&
      nextProps.providerFetchStatus !== 'LOADING'
    ) {
      this._updateProviders(nextProps);
    }

    // Handle animating transitions to show / hide this modal.
    const didTransition =
      this.props.transitionStage === 'TRANSITION_IN' ||
      this.props.transitionStage === 'TRANSITION_OUT';
    const willTransition =
      nextProps.transitionStage === 'TRANSITION_IN' ||
      nextProps.transitionStage === 'TRANSITION_OUT';
    if (didTransition || !willTransition) {
      return;
    }

    // NOTE: This component manages 2 types of transitions. The modal transition
    // that causes this component to fade in and out, and the transitions
    // between the provider search and provider login pages. Below, we are
    // managing the transitioning for the modal view. Will eventually separate
    // the modal transitioning into its own component so we can reduce the
    // complexity of this component.
    const willShow = nextProps.transitionStage === 'TRANSITION_IN';
    const animations = [
      Animated.timing(this._getActiveTransition(), {
        duration: willShow ? TransitionInMillis : TransitionOutMillis,
        easing: Easing.out(Easing.cubic),
        toValue: nextProps.transitionStage === 'TRANSITION_IN' ? 1.0 : 0.0,
      }),
    ];

    if (this.state.pageTransition.type !== 'NOT_TRANSITIONING') {
      invariant(
        nextProps.transitionStage === 'TRANSITION_OUT',
        // eslint-disable-next-line max-len
        'Page transitions should not happen when the Account Verification screen is transitioning in',
      );
      animations.push(
        Animated.timing(this._getInactiveTransition(), {
          duration: TransitionOutMillis,
          easing: Easing.out(Easing.cubic),
          toValue: 0.0,
        }),
      );
    }
    Animated.parallel(animations).start();
  }

  render() {
    const { pageTransition } = this.state;
    switch (pageTransition.type) {
      case 'NOT_TRANSITIONING': {
        const { page } = pageTransition;
        return (
          <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
            {this._renderScreen(page, this._getActiveTransition(), true)}
          </KeyboardAvoidingView>
        );
      }

      case 'TRANSITIONING': {
        const { fromPage, toPage } = pageTransition;
        return (
          <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
            {this._renderScreen(toPage, 1.0, false)}
            {this._renderScreen(fromPage, this._getActiveTransition(), false)}
          </KeyboardAvoidingView>
        );
      }

      default:
        invariant(false, 'Unknown page transition %s', pageTransition.type);
    }
  }

  _renderScreen(
    page: Page,
    opacity: Animated.Value | number,
    enableInteraction: bool,
  ) {
    const { safeAreaInset } = this.state;
    const rootStyles = [
      styles.root,
      {
        bottom: safeAreaInset.bottom,
        left: safeAreaInset.left,
        opacity,
        position: 'absolute',
        right: safeAreaInset.right,
        top: safeAreaInset.top,
      },
    ];
    return (
      <Animated.View style={rootStyles}>
        <Screen>
          <Content>
            {this._renderHeader(page, enableInteraction)}
            {this._renderBanner(page)}
            {this._renderContent(page, enableInteraction)}
          </Content>
          <FooterWithButtons
            buttonLayout={this._getFooterButtonLayout(page, enableInteraction)}
            onPress={this._onFooterButtonPress}
          />
        </Screen>
      </Animated.View>
    );
  }

  _renderHeader(page: Page, enableInteraction: bool) {
    switch (page.type) {
      case 'SEARCH':
        return this._renderSearchHeader(page.search, enableInteraction);
      case 'SEARCH_ERROR':
        return this._renderSearchHeader(page.search, enableInteraction);
      case 'LOGIN':
        return this._renderLoginHeader(
          page.selectedProvider,
          enableInteraction,
        );
      default:
        return invariant(false, 'Unknown page type %s', page.type);
    }
  }

  _renderSearchHeader(search: string, enableInteraction: bool) {
    return (
      <View style={styles.searchHeader}>
        <Image
          resizeMode="contain"
          source={Icons.Search}
          style={styles.searchHeaderIcon}
        />
        <TextInput
          editable={enableInteraction && this.props.transitionStage === 'IN'}
          onChangeText={this._onChangeSearch}
          placeholder="Search for Institutions..."
          ref="searchInput"
          selectTextOnFocus={true}
          spellCheck={false}
          style={styles.searchHeaderTextInput}
          value={search}
        />
      </View>
    );
  }

  _renderLoginHeader(provider: Provider, enableInteraction: bool) {
    invariant(
      provider.sourceOfTruth.type === 'YODLEE',
      'Expecting provider to come from YODLEE',
    );
    const yodleeProvider = provider.sourceOfTruth.value;

    return (
      <View style={styles.loginHeader}>
        <TouchableOpacity onPress={this._onPressHeaderBackIcon}>
          <Image
            resizeMode="contain"
            source={Icons.LeftArrow}
            style={styles.loginHeaderLeftIcon}
          />
        </TouchableOpacity>
        <Text style={[TextDesign.header3, styles.loginHeaderTitle]}>
          {yodleeProvider.name}
        </Text>
        <View style={styles.loginHeaderRightIcon} />
      </View>
    );
  }

  _renderBanner(page: Page) {
    const channels =
      page.type === 'LOGIN' ? [`PROVIDERS/${page.selectedProvider.id}`] : [];
    return <BannerManager channels={channels} managerKey="BANER_MANAGER" />;
  }

  _renderContent(page: Page, enableInteraction: bool) {
    const { providerPendingLoginID, transitionStage } = this.props;
    const { didCompleteInitialSearch } = this.state;

    switch (page.type) {
      case 'SEARCH': {
        return (
          <ProviderSearch
            accountLinkContainer={this.props.accountLinkContainer}
            didCompleteInitialSearch={didCompleteInitialSearch}
            enableInteraction={enableInteraction && transitionStage === 'IN'}
            onSelectProvider={this._onSelectProvider}
            providers={page.providers}
            search={page.search}
          />
        );
      }

      case 'SEARCH_ERROR': {
        return (
          <View style={styles.searchErrorContainer}>
            <Image
              resizeMode="contain"
              source={Icons.Error}
              style={styles.searchErrorIcon}
            />
            <Text style={[TextDesign.error, styles.searchErrorText]}>
              {ProviderSearchError}
            </Text>
          </View>
        );
      }

      case 'LOGIN': {
        const { selectedProvider } = page;
        return (
          <AccountLogin
            isEditable={
              enableInteraction &&
              transitionStage === 'IN' &&
              !providerPendingLoginID
            }
            onChangeLoginForm={loginForm =>
              this._onChangeLoginForm(selectedProvider.id, loginForm)
            }
            onPressForgotPassword={this._onPressForgotPassword}
            loginForm={this.props.loginForms[selectedProvider.id]}
          />
        );
      }

      default:
        return invariant(false, 'Unhandled page: %s', page.type);
    }
  }

  _onKeyboardWillShow = (): void => {
    this.setState({
      safeAreaInset: isIphoneX()
        ? { bottom: 0, left: 0, right: 0, top: 44 }
        : INSET_DEFAULT,
    });
  };

  _onKeyboardWillHide = (): void => {
    this.setState({
      safeAreaInset: isIphoneX()
        ? { bottom: 20, left: 0, right: 0, top: 44 }
        : INSET_DEFAULT,
    });
  };

  _onFooterButtonPress = (button: 'LEFT' | 'RIGHT' | 'CENTER'): void => {
    if (this._isCancelButton(button)) {
      this.props.dispatch(dismissAccountVerification());
      return;
    }
    // Otherwise, it is the login button.
    const page = this._getCurrentPage();
    invariant(
      page.type === 'LOGIN',
      'Expected to be on login page when login button is pressed',
    );
    this.props.dispatch(requestProviderLogin(page.selectedProvider));
  };

  _onChangeSearch = (search: string): void => {
    const page = this._getCurrentPage();
    invariant(
      page.type === 'SEARCH',
      'Expecting page to be SEARCH when changing search',
    );
    this.setState({
      pageTransition: {
        page: {
          providers: page.providers,
          search,
          type: 'SEARCH',
        },
        type: 'NOT_TRANSITIONING',
      },
    });
  };

  _onSelectProvider = (provider: Provider): void => {
    const support = isSupportedProvider(provider);
    if (support.type === 'NO') {
      this.props.dispatch(unsupportedProvider(support.reason));
      return;
    }

    const fromPage = this._getCurrentPage();
    invariant(
      fromPage.type === 'SEARCH',
      'Expecting page to be SEARCH when provider is selected',
    );
    const toPage = {
      providers: fromPage.providers,
      search: fromPage.search,
      selectedProvider: provider,
      type: 'LOGIN',
    };
    this._performPageTransition(fromPage, toPage);
  };

  _onPressHeaderBackIcon = (): void => {
    const fromPage = this._getCurrentPage();
    invariant(
      fromPage.type === 'LOGIN',
      'Expecting page to be LOGIN when back button is pressed',
    );
    const toPage = {
      providers: fromPage.providers,
      search: fromPage.search,
      type: 'SEARCH',
    };
    this._performPageTransition(fromPage, toPage);
  };

  _onPressForgotPassword = (url: string): void => {
    // TODO: Open safari at the url.
    // https://facebook.github.io/react-native/docs/linking.html
  };

  _onChangeLoginForm = (providerID: ID, loginForm: YodleeLoginForm): void => {
    this.props.dispatch(updateLoginForm(providerID, loginForm));
  };

  _updateProviders(props: Props): void {
    const page = this._getCurrentPage();
    const didFail = props.providerFetchStatus === 'FAILURE';
    const { providers } = props;
    switch (page.type) {
      case 'LOGIN': {
        this.setState({
          didCompleteInitialSearch: true,
          pageTransition: {
            page: {
              providers,
              search: page.search,
              selectedProvider: page.selectedProvider,
              type: 'LOGIN',
            },
            type: 'NOT_TRANSITIONING',
          },
        });
        break;
      }

      case 'SEARCH':
      case 'SEARCH_ERROR': {
        this.setState({
          didCompleteInitialSearch: true,
          pageTransition: {
            page: didFail
              ? {
                  search: page.search,
                  type: 'SEARCH_ERROR',
                }
              : {
                  providers,
                  search: page.search,
                  type: 'SEARCH',
                },
            type: 'NOT_TRANSITIONING',
          },
        });
        break;
      }

      default:
        invariant(false, 'Unrecognized page type %s', page.type);
    }
  }

  _performPageTransition(fromPage: Page, toPage: Page): void {
    this.setState(
      {
        pageTransition: {
          fromPage,
          toPage,
          type: 'TRANSITIONING',
        },
      },
      () => {
        this._getInactiveTransition().setValue(1.0);
        Animated.timing(this._getActiveTransition(), {
          duration: 300,
          toValue: 0.0,
          easing: Easing.out(Easing.cubic),
        }).start(() => {
          this.setState({
            activeTransition: this.state.activeTransition === 'A' ? 'B' : 'A',
            pageTransition: {
              page: toPage,
              type: 'NOT_TRANSITIONING',
            },
          });
        });
      },
    );
  }

  _getFooterButtonLayout(page: Page, enableInteraction: bool) {
    const { providerPendingLoginID } = this.props;
    if (page.type === 'LOGIN') {
      const loginForm = this.props.loginForms[page.selectedProvider.id];
      const shouldDisableLoginButton =
        Boolean(providerPendingLoginID) || !canSubmitLoginForm(loginForm);
      const callToAction = getCallToActionForLoginForm(loginForm);
      return {
        isLeftButtonDisabled: !enableInteraction,
        isRightButtonDisabled: !enableInteraction || shouldDisableLoginButton,
        leftButtonText: 'EXIT',
        rightButtonText: callToAction,
        type: 'LEFT_AND_RIGHT',
      };
    }
    return {
      centerButtonText: 'EXIT',
      isCenterButtonDisabled: !enableInteraction,
      type: 'CENTER',
    };
  }

  _getCurrentPage(): Page {
    return this.state.pageTransition.type === 'NOT_TRANSITIONING'
      ? this.state.pageTransition.page
      : this.state.pageTransition.toPage;
  }

  _getActiveTransition(): Animated.Value {
    return this.state.activeTransition === 'A'
      ? this._pageTransitionA
      : this._pageTransitionB;
  }

  _getInactiveTransition(): Animated.Value {
    return this.state.activeTransition === 'A'
      ? this._pageTransitionB
      : this._pageTransitionA;
  }

  _isCancelButton(button: 'LEFT' | 'RIGHT' | 'CENTER') {
    return button === 'CENTER' || button === 'LEFT';
  }
}

function mapReduxStateToProps(state: ReduxState): ComputedProps {
  return {
    accountLinkContainer: getAccountLinkContainer(state),
    loginForms: state.loginForms.loginFormContainer,
    providerFetchStatus: state.providers.status,
    providerPendingLoginID: state.loginForms.providerPendingLoginID,
    providers: state.providers.ordering.map(
      id => state.providers.container[id],
    ),
  };
}

export default (connect(mapReduxStateToProps)(
  AccountVerification,
): ComponentType<ComponentProps>);

const styles = StyleSheet.create({
  bottomArea: {
    backgroundColor: Colors.BACKGROUND,
    bottom: 0,
    height: 40,
    left: 0,
    position: 'absolute',
    right: 0,
  },

  loginHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.BORDER_HAIRLINE,
    flexDirection: 'row',
    height: NavBarHeight,
  },

  loginHeaderLeftIcon: {
    marginLeft: 16,
    width: LEFT_ARROW_WIDTH,
  },

  loginHeaderTitle: {
    flex: 1,
    textAlign: 'center',
  },

  loginHeaderRightIcon: {
    marginRight: 16,
    width: LEFT_ARROW_WIDTH,
  },

  root: {
    backgroundColor: Colors.BACKGROUND,
    flex: 1,
  },

  searchErrorContainer: {
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 16,
  },

  searchErrorIcon: {
    marginBottom: 8,
    width: 30,
  },

  searchErrorText: {
    textAlign: 'center',
  },

  searchHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.BORDER_HAIRLINE,
    flexDirection: 'row',
    // Add 1 since hairline border is not inclusive of width in normal nav bar.
    height: NavBarHeight + 1,
  },

  searchHeaderIcon: {
    marginLeft: 16,
  },

  searchHeaderTextInput: {
    fontFamily: TextDesign.thickFont,
    fontSize: TextDesign.largeFontSize,
    marginLeft: 16,
  },
});

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

function getCallToActionForLoginForm(loginForm: YodleeLoginForm): string {
  return loginForm.formType === 'login' ? 'LOGIN' : 'SUBMIT';
}

function canSubmitLoginForm(loginForm: YodleeLoginForm): bool {
  for (const row of loginForm.row) {
    for (const field of row.field) {
      if (!field.isOptional && field.value.length === 0) {
        return false;
      }
    }
  }
  return true;
}

// TODO: This is a hack to fix the safe area bugs, since it does not work
// well in a modal view inside a keyboard avoiding view.
function isIphoneX() {
  let d = Dimensions.get('window');
  const { height, width } = d;

  return (
    // This has to be iOS duh
    Platform.OS === 'ios' &&
    // Accounting for the height in either orientation
    (height === 812 || width === 812)
  );
}
