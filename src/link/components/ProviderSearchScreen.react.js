/* @flow */

import Content from '../../components/shared/Content.react';
import Downloading from '../../components/shared/Downloading.react';
import FooterWithButtons from '../../components/shared/FooterWithButtons.react';
import Icons from '../../design/icons';
import React, { Component } from 'react';
import Screen from '../../components/shared/Screen.react';
import Themes from '../../design/themes';

import invariant from 'invariant';

import {
  ActivityIndicator,
  FlatList,
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
import { getAccountLinkContainer } from '../../common/state-utils';
import { getProviders } from '../../data-model/state/providers';
import { isLinking } from 'common/lib/models/AccountLink';
import { NavBarHeight } from '../../design/layout';
import { ProviderSearchError } from '../../../content/index';

import type { AccountLink } from 'common/lib/models/AccountLink';
import type { ModelContainer } from '../../datastore';
import type { Provider } from 'common/lib/models/Provider';
import type { ReduxProps, ReduxState } from '../../typesDEPRECATED/redux';

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
    const theme = Themes.primary;
    return (
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
          editable={this.props.enableInteraction}
          onChangeText={this._onChangeSearch}
          placeholder="Search for Institutions..."
          ref="searchInput"
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
      <View style={styles.searchResults}>
        <FlatList
          data={this.props.providers}
          keyExtractor={provider => provider.id}
          keyboardShouldPersistTaps="always"
          renderItem={this._renderProvider}
        />
      </View>
    );
  }

  _renderSearchError() {
    const theme = Themes.primary;
    return (
      <View style={styles.searchErrorContainer}>
        <Image
          resizeMode="contain"
          source={Icons.Error}
          style={styles.searchErrorIcon}
        />
        <Text style={[theme.getTextStyleError(), styles.searchErrorText]}>
          {ProviderSearchError}
        </Text>
      </View>
    );
  }

  _renderProvider = ({ item }: { item: Provider }) => {
    const theme = Themes.primary;
    const isFirst = this.props.providers[0] === item;
    const itemStyles = [
      styles.searchResultsItem,
      {
        backgroundColor: theme.color.backgroundListItem,
        borderColor: theme.color.borderNormal,
      },
      isFirst ? { marginTop: 4 } : null,
    ];
    const nameStyles = [
      theme.getTextStyleHeader3(),
      styles.searchResultsItemName,
    ];
    invariant(
      item.sourceOfTruth.type === 'YODLEE',
      'Expecting provider to come from YODLEE',
    );
    const yodleeProvider = item.sourceOfTruth.value;
    const accountLink = this._getAccountLinkForProvider(item);
    const providerName = yodleeProvider.name;
    const baseURL = yodleeProvider.baseUrl;
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.enableInteraction && this._onSelectProvider(item)
        }
      >
        <View style={itemStyles}>
          <View style={styles.searchResultsItemContent}>
            <Text style={nameStyles}>{providerName}</Text>
            <Text style={theme.getTextStyleSmall()}>{baseURL}</Text>
          </View>
          {accountLink && isLinking(accountLink) ? <Downloading /> : null}
        </View>
      </TouchableOpacity>
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
}

function mapReduxStateToProps(state: ReduxState): ComputedProps {
  const { didCompleteInitialSearch } = state.accountVerification;
  return {
    accountLinkContainer: getAccountLinkContainer(state),
    didCompleteInitialSearch,
    enableInteraction: true,
    providerFetchStatus: state.providers.status,
    providers: getProviders(state),
    searchText: state.accountVerification.providerSearchText,
  };
}

export default connect(mapReduxStateToProps)(ProviderSearchScreen);

const styles = StyleSheet.create({
  loadingResults: {
    alignItems: 'center',
    marginTop: 24,
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

  searchResults: {
    flex: 1,
  },

  searchResultsItem: {
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 4,
    marginHorizontal: 4,
    padding: 8,
  },

  searchResultsItemContent: {
    flex: 1,
  },

  searchResultsItemName: {
    marginBottom: 2,
  },
});
