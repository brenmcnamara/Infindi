/* @flow */

import Content from '../../components/shared/Content.react';
import DataModelStateUtils from '../../data-model/state-utils';
import Downloading from '../../components/shared/Downloading.react';
import FooterWithButtons from '../../components/shared/FooterWithButtons.react';
import Icons from '../../design/icons';
import List from '../../list-ui/List.react';
import React, { Component } from 'react';
import Screen from '../../components/shared/Screen.react';

import invariant from 'invariant';

import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import {
  exitAccountVerification,
  requestProviderLogin,
  updateProviderSearchText,
} from '../action';
import { getContainer } from '../../datastore';
import { GetTheme } from '../../design/components/Theme.react';
import { isLinking } from 'common/lib/models/AccountLink';
import { NavBarHeight } from '../../design/layout';
import { ProviderSearchError } from '../../../content/index';

import type { AccountLink } from 'common/lib/models/AccountLink';
import type { ModelContainer } from '../../datastore';
import type { Provider } from 'common/lib/models/Provider';
import type { ReduxProps, ReduxState } from '../../store';

export type Props = ComponentProps & ComputedProps & ReduxProps;

type ComponentProps = {};

type ComputedProps = {
  accountLinkContainer: AccountLinkContainer,
  didCompleteInitialSearch: boolean,
  enableInteraction: boolean,
  providerFetchStatus: 'LOADING' | 'STEADY' | 'EMPTY' | 'FAILURE',
  providers: Array<Provider>,
  searchText: string,
};

type AccountLinkContainer = ModelContainer<'AccountLink', AccountLink>;

const LIST_CONTENT_INSET = { bottom: 4, left: 0, right: 0, top: 0 };
const PROVIDER_ITEM_HEIGHT = 65;

class ProviderSearchScreen extends Component<Props> {
  render() {
    const { didCompleteInitialSearch, providerFetchStatus } = this.props;
    const shouldShowError = providerFetchStatus === 'FAILURE';

    return (
      <Screen>
        <Content>
          {this._renderHeader()}
          {shouldShowError
            ? this._renderSearchError()
            : didCompleteInitialSearch
              ? this._renderSearchResults()
              : this._renderLoading()}
        </Content>
        <FooterWithButtons
          buttonLayout={this._getFooterButtonLayout()}
          onPress={this._onFooterButtonPress}
        />
      </Screen>
    );
  }

  _renderHeader() {
    return (
      <GetTheme>
        {theme => (
          <View
            style={[
              styles.searchHeader,
              { borderColor: theme.color.borderHairline },
            ]}
          >
            <Image
              resizeMode="contain"
              source={Icons.Search}
              style={styles.searchHeaderIcon}
            />
            <TextInput
              defaultValue={this.props.searchText}
              editable={this.props.enableInteraction}
              onChangeText={this._onChangeSearch}
              placeholder="Search for Institutions..."
              selectTextOnFocus={true}
              spellCheck={false}
              style={[
                styles.searchHeaderTextInput,
                {
                  fontFamily: theme.fontFamily.thick,
                  fontSize: theme.fontSize.header3,
                },
              ]}
            />
          </View>
        )}
      </GetTheme>
    );
  }

  _renderLoading() {
    return (
      <View style={styles.loadingResults}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  _renderSearchResults() {
    return (
      <View style={styles.providerListContainer}>
        <List
          contentInset={LIST_CONTENT_INSET}
          data={this._getData()}
          keyboardShouldPersistTaps="always"
          initialNumToRender={20}
        />
      </View>
    );
  }

  _renderSearchError() {
    return (
      <GetTheme>
        {theme => (
          <View style={styles.searchErrorContainer}>
            <Image
              resizeMode="contain"
              source={Icons.Error}
              style={styles.searchErrorIcon}
            />
            <Text style={[theme.getTextStyleAlert(), styles.searchErrorText]}>
              {ProviderSearchError}
            </Text>
          </View>
        )}
      </GetTheme>
    );
  }

  _renderProvider = (provider: Provider) => {
    invariant(
      provider.sourceOfTruth.type === 'YODLEE',
      'Expecting provider to come from YODLEE',
    );
    const yodleeProvider = provider.sourceOfTruth.value;
    const accountLink = this._getAccountLinkForProvider(provider);
    const providerName = yodleeProvider.name;
    const baseURL = yodleeProvider.baseUrl;
    return (
      <GetTheme>
        {theme => (
          <TouchableOpacity
            onPress={() =>
              this.props.enableInteraction && this._onSelectProvider(provider)
            }
            style={{ flex: 1 }}
          >
            <View style={styles.providerRoot}>
              <View
                style={[
                  styles.providerContent,
                  {
                    backgroundColor: theme.color.backgroundListItem,
                    borderColor: theme.color.borderNormal,
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[theme.getTextStyleHeader3(), styles.providerName]}
                  >
                    {providerName}
                  </Text>
                  <Text style={theme.getTextStyleSmall()}>{baseURL}</Text>
                </View>
                {accountLink && isLinking(accountLink) ? <Downloading /> : null}
              </View>
            </View>
          </TouchableOpacity>
        )}
      </GetTheme>
    );
  };

  _onChangeSearch = (text: string): void => {
    this.props.dispatch(updateProviderSearchText(text));
  };

  _onSelectProvider = (provider: Provider): void => {
    this.props.dispatch(requestProviderLogin(provider.id));
  };

  _onFooterButtonPress = (): void => {
    this.props.dispatch(exitAccountVerification());
  };

  _getAccountLinkForProvider(provider: Provider): AccountLink | null {
    const container = this.props.accountLinkContainer;
    for (const id in container) {
      if (
        container.hasOwnProperty(id) &&
        container[id].providerRef.refID === provider.id
      ) {
        return container[id];
      }
    }
    return null;
  }

  _getFooterButtonLayout() {
    return {
      centerButtonText: 'EXIT',
      isCenterButtonDisabled: !this.props.enableInteraction,
      type: 'CENTER',
    };
  }

  _getData() {
    return this.props.providers.map((provider, index) => ({
      Comp: () => this._renderProvider(provider),
      height: PROVIDER_ITEM_HEIGHT,
      key: provider.id,
    }));
  }
}

function mapReduxStateToProps(state: ReduxState): ComputedProps {
  const { didCompleteInitialSearch } = state.accountVerification;
  return {
    accountLinkContainer: getContainer(state.accountLinks) || {},
    didCompleteInitialSearch,
    enableInteraction: true,
    providerFetchStatus: state.providers.status,
    providers: DataModelStateUtils.getProviders(state),
    searchText: state.accountVerification.providerSearchText,
  };
}

export default connect(mapReduxStateToProps)(ProviderSearchScreen);

const styles = StyleSheet.create({
  loadingResults: {
    alignItems: 'center',
    marginTop: 24,
  },

  providerContent: {
    alignItems: 'center',
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    marginTop: 4,
    padding: 8,
  },

  providerListContainer: {
    flex: 1,
  },

  providerName: {
    marginBottom: 2,
  },

  providerRoot: {
    flex: 1,
    marginHorizontal: 4,
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
    flexDirection: 'row',
    // Add 1 since hairline border is not inclusive of width in normal nav bar.
    height: NavBarHeight + 1,
  },

  searchHeaderIcon: {
    marginLeft: 16,
  },

  searchHeaderTextInput: {
    marginLeft: 16,
  },
});
