/* @flow */

import AccountLinkStateUtils from '../../data-model/state-utils/AccountLink';
import Content from '../../shared/Content.react';
import Downloading from '../../shared/Downloading.react';
import Icons from '../../design/icons';
import List from '../../list-ui/List.react';
import React, { Component } from 'react';
import Screen from '../../shared/Screen.react';

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
import { GetTheme } from '../../design/components/Theme.react';
import { NavBarHeight } from '../../design/layout';
import { ProviderSearchError } from '../../../content/index';
import { requestProviderLogin, updateProviderSearchText } from '../Actions';
import { throttle } from '../../common/generic-utils';

import type AccountLink, {
  AccountLinkCollection,
} from 'common/lib/models/AccountLink';
import type Provider, {
  ProviderOrderedCollection,
} from 'common/lib/models/Provider';

import type { ElementRef } from 'react';
import type { LoadState } from '../../data-model/types';
import type { ReduxProps, ReduxState } from '../../store';

export type Props = ComponentProps & ComputedProps & ReduxProps;

type ComponentProps = {};

type ComputedProps = {
  accountLinks: AccountLinkCollection,
  didCompleteInitialSearch: boolean,
  enableInteraction: boolean,
  providerLoadState: LoadState,
  providers: ProviderOrderedCollection,
  searchText: string,
};

const LIST_CONTENT_INSET = { bottom: 4, left: 0, right: 0, top: 0 };
const PROVIDER_ITEM_HEIGHT = 65;

class ProviderSearchScreen extends Component<Props> {
  _searchRef: ElementRef<typeof TextInput> | null = null;

  render() {
    const { didCompleteInitialSearch, providerLoadState } = this.props;
    const shouldShowError = providerLoadState.type === 'FAILURE';

    return (
      <Screen avoidNavBar={true}>
        <Content>
          {this._renderHeader()}
          {shouldShowError
            ? this._renderSearchError()
            : didCompleteInitialSearch
              ? this._renderSearchResults()
              : this._renderLoading()}
        </Content>
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
            <TouchableOpacity onPress={this._onPressSearchIcon}>
              <Image
                resizeMode="contain"
                source={Icons.Search}
                style={styles.searchHeaderIcon}
              />
            </TouchableOpacity>
            <TextInput
              defaultValue={this.props.searchText}
              editable={this.props.enableInteraction}
              onChangeText={this._onChangeSearch}
              placeholder="Search for Institutions..."
              ref={ref => (this._searchRef = ref)}
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
                {accountLink && accountLink.isLinking ? <Downloading /> : null}
              </View>
            </View>
          </TouchableOpacity>
        )}
      </GetTheme>
    );
  };

  _onPressSearchIcon = (): void => {
    if (!this._searchRef) {
      return;
    }
    this._searchRef.focus();
  };

  _onChangeSearch = (text: string): void => {
    this.props.dispatch(updateProviderSearchText(text));
  };

  _onSelectProvider = throttle(500, (provider: Provider): void => {
    this.props.dispatch(requestProviderLogin(provider.id));
  });

  _getAccountLinkForProvider(provider: Provider): AccountLink | null {
    return (
      this.props.accountLinks.find(
        accountLink => accountLink.providerRef.refID === provider.id,
      ) || null
    );
  }

  _getFooterButtonLayout() {
    return {
      centerButtonText: 'EXIT',
      isCenterButtonDisabled: !this.props.enableInteraction,
      type: 'CENTER',
    };
  }

  _getData() {
    return this.props.providers
      .map((provider, index) => ({
        Comp: () => this._renderProvider(provider),
        height: PROVIDER_ITEM_HEIGHT,
        key: provider.id,
      }))
      .toArray();
  }
}

function mapReduxStateToProps(reduxState: ReduxState): ComputedProps {
  const { didCompleteInitialSearch } = reduxState.accountVerification;
  return {
    accountLinks: AccountLinkStateUtils.getCollection(reduxState),
    didCompleteInitialSearch,
    enableInteraction: true,
    providerLoadState: reduxState.providerFuzzySearch.loadState,
    providers: reduxState.providerFuzzySearch.orderedCollection,
    searchText: reduxState.accountVerification.providerSearchText,
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
    flex: 1,
    paddingLeft: 16,
    paddingVertical: 4,
  },
});
