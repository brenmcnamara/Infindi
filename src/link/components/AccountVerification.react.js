/* @flow */

import AccountLogin from './AccountLogin.react';
import BannerManager from '../../components/shared/BannerManager.react';
import Colors from '../../design/colors';
import Content from '../../components/shared/Content.react';
import FooterWithButtons from '../../components/shared/FooterWithButtons.react';
import Icons from '../../design/icons';
import ProviderSearch from './ProviderSearch.react';
import ProviderSearchManager from './ProviderSearchManager';
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
import { isLinking } from 'common/lib/models/AccountLink';
import { isSupportedProvider } from '../utils';
import {
  dismissAccountVerification,
  requestProviderLogin,
  unsupportedProvider,
} from '../action';
import { getAccountLinkCollection } from '../../common/state-utils';
import { NavBarHeight } from '../../design/layout';
import { ProviderSearchError } from '../../../content';

import type { AccountLink } from 'common/lib/models/AccountLink';
import type { ComponentType } from 'react';
import type { ID } from 'common/types/core';
import type { ModelCollection } from '../../datastore';
import type { Provider } from 'common/lib/models/Provider';
import type { ReduxProps } from '../../typesDEPRECATED/redux';
import type { State as ReduxState } from '../../reducers/root';
import type { Subscription } from './ProviderSearchManager';
import type { TransitionStage } from '../../reducers/modalState';

export type ComponentProps = {
  transitionStage: TransitionStage,
};

export type ReduxStateProps = {
  accountLinkCollection: AccountLinkCollection,
  providerPendingLoginID: ID | null,
};

export type Props = ReduxProps & ReduxStateProps & ComponentProps;

type AccountLinkCollection = ModelCollection<'AccountLink', AccountLink>;

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

type State = {
  didCompleteInitialSearch: bool,
  page: Page,
  safeAreaInset: Inset,
};

// TODO: BUG: Click on Add Account / Cancel many times really fast to get
// modal view to throw an error.
export const TransitionInMillis = 400;
export const TransitionOutMillis = 400;

const LEFT_ARROW_WIDTH = 18;
const INSET_DEFAULT = { bottom: 0, left: 0, right: 0, top: 20 };

class AccountVerification extends Component<Props, State> {
  _searchManager: ProviderSearchManager = new ProviderSearchManager();
  _searchSubscription: Subscription | null = null;
  _transitionValue: Animated.Value;

  constructor(props: Props) {
    super(props);
    this._transitionValue = new Animated.Value(
      props.transitionStage === 'IN' ? 1.0 : 0.0,
    );

    const payload = this._searchManager.getProvidersPayload();
    const page =
      payload.type === 'SUCCESS'
        ? {
            providers: payload.providers,
            search: '',
            type: 'SEARCH',
          }
        : {
            search: '',
            type: 'SEARCH_ERROR',
          };

    this.state = {
      didCompleteInitialSearch: false,
      page,
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
    this._searchSubscription = this._searchManager.listenToSearchResults(
      this._onUpdateSearchResults,
    );

    // Start initial search.
    const { page } = this.state;
    const search = page.type === 'SEARCH' ? page.search : '';
    this._searchManager.updateSearch(search);
  }

  componentWillUnmount(): void {
    this._searchSubscription && this._searchSubscription();
    this._searchManager.clearSearch();
    Keyboard.removeListener('keyboardWillShow', this._onKeyboardWillShow);
    Keyboard.removeListener('keyboardWillHide', this._onKeyboardWillHide);
  }

  componentWillReceiveProps(nextProps: Props): void {
    // Handle animating transitions to show / hide this modal.
    const didTransition =
      this.props.transitionStage === 'TRANSITION_IN' ||
      this.props.transitionStage === 'TRANSITION_OUT';
    const willTransition =
      nextProps.transitionStage === 'TRANSITION_IN' ||
      nextProps.transitionStage === 'TRANSITION_OUT';
    if (!didTransition && willTransition) {
      const willShow = nextProps.transitionStage === 'TRANSITION_IN';
      Animated.timing(this._transitionValue, {
        duration: willShow ? TransitionInMillis : TransitionOutMillis,
        easing: Easing.out(Easing.cubic),
        toValue: nextProps.transitionStage === 'TRANSITION_IN' ? 1.0 : 0.0,
      }).start();
    }

    // Handle dismissing when we figure out the status of the refresh.
    const { page } = this.state;
    if (
      page.type !== 'LOGIN' ||
      this.props.accountLinkCollection === nextProps.accountLinkCollection
    ) {
      return;
    }
    const didHavePendingLogin = Boolean(this.props.providerPendingLoginID);
    const willHavePendingLogin = Boolean(nextProps.providerPendingLoginID);
    const { selectedProvider } = page;
    const accountLink = getAccountLinkForProvider(
      nextProps.accountLinkCollection,
      selectedProvider,
    );
    const isLinkingSelectedProvider = accountLink && isLinking(accountLink);

    if (
      didHavePendingLogin &&
      !willHavePendingLogin &&
      isLinkingSelectedProvider
    ) {
      this.props.dispatch(dismissAccountVerification());
    }
  }

  render() {
    const rootStyles = [
      styles.root,
      {
        opacity: this._transitionValue,
      },
    ];
    const { safeAreaInset } = this.state;
    const insetStyles = {
      flex: 1,
      paddingBottom: safeAreaInset.bottom,
      paddingLeft: safeAreaInset.left,
      paddingRight: safeAreaInset.right,
      paddingTop: safeAreaInset.top,
    };
    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <Animated.View style={rootStyles}>
          <View style={insetStyles}>
            <Screen>
              <Content>
                {this._renderHeader()}
                {this._renderBanner()}
                {this._renderContent()}
              </Content>
              <FooterWithButtons
                buttonLayout={this._getFooterButtonLayout()}
                onPress={this._onFooterButtonPress}
              />
            </Screen>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    );
  }

  _renderHeader() {
    const { page } = this.state;
    switch (page.type) {
      case 'SEARCH':
        return this._renderSearchHeader(page.search);
      case 'SEARCH_ERROR':
        return this._renderSearchHeader(page.search);
      case 'LOGIN':
        return this._renderLoginHeader(page.selectedProvider);
      default:
        return invariant(false, 'Unknown page type %s', page.type);
    }
  }

  _renderSearchHeader(search: string) {
    return (
      <View style={styles.searchHeader}>
        <Image
          resizeMode="contain"
          source={Icons.Search}
          style={styles.searchHeaderIcon}
        />
        <TextInput
          editable={this.props.transitionStage === 'IN'}
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

  _renderLoginHeader(provider: Provider) {
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

  _renderBanner() {
    const { page } = this.state;
    const channels =
      page.type === 'LOGIN' ? [`PROVIDERS/${page.selectedProvider.id}`] : [];
    return <BannerManager channels={channels} managerKey="BANER_MANAGER" />;
  }

  _renderContent() {
    const { providerPendingLoginID, transitionStage } = this.props;
    const { didCompleteInitialSearch, page } = this.state;

    switch (page.type) {
      case 'SEARCH': {
        return (
          <ProviderSearch
            accountLinkCollection={this.props.accountLinkCollection}
            didCompleteInitialSearch={didCompleteInitialSearch}
            isEditable={transitionStage === 'IN'}
            search={page.search}
            onSelectProvider={this._onSelectProvider}
            providers={page.providers}
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
        const provider = page.selectedProvider;
        return (
          <AccountLogin
            isEditable={transitionStage === 'IN' && !providerPendingLoginID}
            onChangeProvider={this._onChangeProvider}
            onPressForgotPassword={this._onPressForgotPassword}
            provider={provider}
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
    const { page } = this.state;
    invariant(
      page.type === 'LOGIN',
      'Expected to be on login page when login button is pressed',
    );
    this.props.dispatch(requestProviderLogin(page.selectedProvider));
  };

  _onChangeSearch = (search: string): void => {
    const { page } = this.state;
    invariant(
      page.type === 'SEARCH',
      'Expecting page to be SEARCH when changing search',
    );
    this.setState({
      page: {
        providers: page.providers,
        search,
        type: 'SEARCH',
      },
    });
    this._searchManager.updateSearch(search);
  };

  _onSelectProvider = (provider: Provider): void => {
    const support = isSupportedProvider(provider);
    if (support.type === 'NO') {
      this.props.dispatch(unsupportedProvider(support.reason));
      return;
    }

    const { page } = this.state;
    invariant(
      page.type === 'SEARCH',
      'Expecting page to be SEARCH when provider is selected',
    );
    this.setState({
      page: {
        providers: page.providers,
        search: page.search,
        selectedProvider: provider,
        type: 'LOGIN',
      },
    });
  };

  _onPressHeaderBackIcon = (): void => {
    const { page } = this.state;
    invariant(
      page.type === 'LOGIN',
      'Expecting page to be LOGIN when back button is pressed',
    );
    this.setState({
      page: {
        providers: page.providers,
        search: page.search,
        type: 'SEARCH',
      },
    });
  };

  _onPressForgotPassword = (url: string): void => {
    // TODO: Open safari at the url.
    // https://facebook.github.io/react-native/docs/linking.html
  };

  _onChangeProvider = (provider: Provider): void => {
    const { page } = this.state;
    invariant(
      page.type === 'LOGIN',
      'Expecting page to be LOGIN while changing provider',
    );
    this.setState({
      page: {
        providers: page.providers,
        search: page.search,
        selectedProvider: provider,
        type: 'LOGIN',
      },
    });
  };

  _onUpdateSearchResults = (): void => {
    const { page } = this.state;
    const payload = this._searchManager.getProvidersPayload();

    switch (page.type) {
      case 'LOGIN': {
        this.setState({
          didCompleteInitialSearch: true,
          page: {
            providers: payload.type === 'SUCCESS' ? payload.providers : [],
            search: page.search,
            selectedProvider: page.selectedProvider,
            type: 'LOGIN',
          },
        });
        break;
      }

      case 'SEARCH':
      case 'SEARCH_ERROR': {
        this.setState({
          didCompleteInitialSearch: true,
          page:
            payload.type === 'SUCCESS'
              ? {
                  providers: payload.providers,
                  search: page.search,
                  type: 'SEARCH',
                }
              : {
                  search: page.search,
                  type: 'SEARCH_ERROR',
                },
        });
        break;
      }

      default:
        invariant(false, 'Unrecognized page type %s', page.type);
    }
  };

  _getFooterButtonLayout() {
    const { providerPendingLoginID } = this.props;
    const { page } = this.state;
    if (page.type === 'LOGIN') {
      const { selectedProvider } = page;
      const authValues = getAuthValues(selectedProvider);
      const shouldDisableLoginButton =
        Boolean(providerPendingLoginID) ||
        authValues.some(val => !val || val.length === 0);
      return {
        isRightButtonDisabled: shouldDisableLoginButton,
        leftButtonText: 'EXIT',
        rightButtonText: 'LOGIN',
        type: 'LEFT_AND_RIGHT',
      };
    }
    return {
      centerButtonText: 'EXIT',
      type: 'CENTER',
    };
  }

  _isCancelButton(button: 'LEFT' | 'RIGHT' | 'CENTER') {
    return button === 'CENTER' || button === 'LEFT';
  }
}

function mapReduxStateToProps(state: ReduxState): ReduxStateProps {
  return {
    accountLinkCollection: getAccountLinkCollection(state),
    providerPendingLoginID: state.providers.providerPendingLogin
      ? state.providers.providerPendingLogin.id
      : null,
  };
}

export default (connect(mapReduxStateToProps)(
  AccountVerification,
): ComponentType<ComponentProps>);

export function getAuthValues(provider: Provider): Array<string> {
  invariant(
    provider.sourceOfTruth.type === 'YODLEE',
    'Expecting provider to come from YODLEE',
  );
  return provider.sourceOfTruth.value.loginForm.row.map(
    entry => entry.field[0].value,
  );
}

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

function getAccountLinkForProvider(
  collection: AccountLinkCollection,
  provider: Provider,
): AccountLink | null {
  for (const accountLinkID in collection) {
    if (
      collection.hasOwnProperty(accountLinkID) &&
      collection[accountLinkID].providerRef.refID === provider.id
    ) {
      return collection[accountLinkID];
    }
  }
  return null;
}
