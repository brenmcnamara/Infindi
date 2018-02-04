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
  Easing,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { isSupportedProvider } from '../utils';
import { dismissAccountVerification, unsupportedProvider } from '../action';
import { genYodleeProviderLogin } from '../../backend';
import { getYodleeRefreshInfoCollection } from '../../store/state-utils';
import { NavBarHeight } from '../../design/layout';

import type { ComponentType } from 'react';
import type { ID } from 'common/types/core';
import type { ModelCollection } from '../../datastore';
import type { Provider as YodleeProvider } from 'common/lib/models/YodleeProvider';
import type { ReduxProps } from '../../typesDEPRECATED/redux';
import type { State as ReduxState } from '../../reducers/root';
import type { Subscription } from './ProviderSearchManager';
import type { TransitionStage } from '../../reducers/modalState';
import type { YodleeRefreshInfo } from 'common/lib/models/YodleeRefreshInfo';

export type ComponentProps = {
  transitionStage: TransitionStage,
};

export type ReduxStateProps = {
  refreshInfo: ModelCollection<'YodleeRefreshInfo', YodleeRefreshInfo>,
};

export type Props = ReduxProps & ReduxStateProps & ComponentProps;

type Page =
  | {|
      +providers: Array<YodleeProvider>,
      +search: string,
      +type: 'SEARCH',
    |}
  | {|
      +providers: Array<YodleeProvider>,
      +search: string,
      +selectedProvider: YodleeProvider,
      +type: 'LOGIN',
    |};

type State = {
  page: Page,
};

// TODO: BUG: Click on Add Account / Cancel many times really fast to get
// modal view to throw an error.
export const TransitionInMillis = 400;
export const TransitionOutMillis = 400;

const LEFT_ARROW_WIDTH = 18;

class AccountVerification extends Component<Props, State> {
  _searchManager: ProviderSearchManager = new ProviderSearchManager();
  _searchSubscription: Subscription | null = null;
  _transitionValue: Animated.Value;

  constructor(props: Props) {
    super(props);
    this._transitionValue = new Animated.Value(
      props.transitionStage === 'IN' ? 1.0 : 0.0,
    );

    this.state = {
      page: {
        providers: this._searchManager.getProviders(),
        search: '',
        type: 'SEARCH',
      },
    };
  }

  componentDidMount(): void {
    this._searchSubscription = this._searchManager.listenToSearchResults(
      this._onUpdateSearchResults,
    );
  }

  componentWillUnmount(): void {
    this._searchSubscription && this._searchSubscription();
    this._searchManager.clearSearch();
  }

  componentWillReceiveProps(nextProps: Props): void {
    const didTransition =
      this.props.transitionStage === 'TRANSITION_IN' ||
      this.props.transitionStage === 'TRANSITION_OUT';
    const willTransition =
      nextProps.transitionStage === 'TRANSITION_IN' ||
      nextProps.transitionStage === 'TRANSITION_OUT';
    if (didTransition || !willTransition) {
      return;
    }
    Animated.timing(this._transitionValue, {
      duration: nextProps.show ? TransitionInMillis : TransitionOutMillis,
      easing: Easing.out(Easing.cubic),
      toValue: nextProps.transitionStage === 'TRANSITION_IN' ? 1.0 : 0.0,
    }).start();
  }

  render() {
    const rootStyles = [
      styles.root,
      {
        opacity: this._transitionValue,
      },
    ];
    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <Animated.View style={rootStyles}>
          <SafeAreaView style={styles.safeArea}>
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
          </SafeAreaView>
        </Animated.View>
      </KeyboardAvoidingView>
    );
  }

  _renderHeader() {
    const { page } = this.state;
    return page.type === 'SEARCH'
      ? this._renderSearchHeader(page.search)
      : this._renderLoginHeader(page.selectedProvider);
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

  _renderLoginHeader(provider: YodleeProvider) {
    const rawProvider = provider.raw;
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
          {rawProvider.name}
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
    const { transitionStage } = this.props;
    const { page } = this.state;

    switch (page.type) {
      case 'SEARCH': {
        return (
          <ProviderSearch
            isEditable={transitionStage === 'IN'}
            search={page.search}
            onSelectProvider={this._onSelectProvider}
            providers={page.providers}
          />
        );
      }

      case 'LOGIN': {
        const provider = page.selectedProvider;
        return (
          <AccountLogin
            isEditable={transitionStage === 'IN'}
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

  _onFooterButtonPress = async (
    button: 'LEFT' | 'RIGHT' | 'CENTER',
  ): Promise<void> => {
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
    const { selectedProvider } = page;
    try {
      await genYodleeProviderLogin(selectedProvider);
    } catch (error) {
      console.log('LOGIN ERROR', error);
      throw error;
    }
    console.log('LOGIN SUCCESS');
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

  _onSelectProvider = (provider: YodleeProvider): void => {
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

  _onChangeProvider = (provider: YodleeProvider): void => {
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
    const providers = this._searchManager.getProviders();

    switch (page.type) {
      case 'LOGIN': {
        this.setState({
          page: {
            providers,
            search: page.search,
            selectedProvider: page.selectedProvider,
            type: 'LOGIN',
          },
        });
        break;
      }

      case 'SEARCH': {
        this.setState({
          page: {
            providers,
            search: page.search,
            type: 'SEARCH',
          },
        });
        break;
      }

      default:
        invariant(false, 'Unrecognized page type %s', page.type);
    }
  };

  _getFooterButtonLayout() {
    return this.state.page.type === 'SEARCH'
      ? {
          centerButtonText: 'CANCEL',
          type: 'CENTER',
        }
      : {
          leftButtonText: 'CANCEL',
          rightButtonText: 'LOGIN',
          type: 'LEFT_AND_RIGHT',
        };
  }

  _isCancelButton(button: 'LEFT' | 'RIGHT' | 'CENTER') {
    return button === 'CENTER' || button === 'LEFT';
  }

  _getRefreshInfoForProvider(providerID: ID): YodleeRefreshInfo | null {
    const { refreshInfo } = this.props;
    for (const id in refreshInfo) {
      if (
        refreshInfo.hasOwnProperty(id) &&
        refreshInfo[id].providerRef.refID === providerID
      ) {
        return refreshInfo[id];
      }
    }
    return null;
  }
}

function mapReduxStateToProps(state: ReduxState): ReduxStateProps {
  return {
    refreshInfo: getYodleeRefreshInfoCollection(state),
  };
}

export default (connect(mapReduxStateToProps)(
  AccountVerification,
): ComponentType<ComponentProps>);

const styles = StyleSheet.create({
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

  safeArea: {
    flex: 1,
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
