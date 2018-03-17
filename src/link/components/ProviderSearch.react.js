/* @flow */

import Colors from '../../design/colors';
import Downloading from '../../components/shared/Downloading.react';
import React, { Component } from 'react';
import TextDesign from '../../design/text';

import invariant from 'invariant';

import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { isLinking } from 'common/lib/models/AccountLink';

import type { AccountLink } from 'common/lib/models/AccountLink';
import type { ModelContainer } from '../../datastore';
import type { Provider } from 'common/lib/models/Provider';

export type Props = {
  accountLinkContainer: AccountLinkContainer,
  didCompleteInitialSearch: bool,
  enableInteraction: bool,
  onSelectProvider: (provider: Provider) => any,
  providers: Array<Provider>,
  search: string,
};

type AccountLinkContainer = ModelContainer<'AccountLink', AccountLink>;

export default class ProviderSearch extends Component<Props> {
  _transitionValue: Animated.Value;

  render() {
    return (
      <View style={styles.root}>
        {this.props.didCompleteInitialSearch
          ? this._renderSearchResults()
          : this._renderLoading()}
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

  _renderProvider = ({ item }: { item: Provider }) => {
    const isFirst = this.props.providers[0] === item;
    const itemStyles = [
      styles.searchResultsItem,
      isFirst ? { marginTop: 4 } : null,
    ];
    const nameStyles = [TextDesign.header3, styles.searchResultsItemName];
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
          this.props.enableInteraction && this.props.onSelectProvider(item)
        }
      >
        <View style={itemStyles}>
          <View style={styles.searchResultsItemContent}>
            <Text style={nameStyles}>{providerName}</Text>
            <Text style={TextDesign.small}>{baseURL}</Text>
          </View>
          {accountLink && isLinking(accountLink) ? <Downloading /> : null}
        </View>
      </TouchableOpacity>
    );
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
}

const styles = StyleSheet.create({
  loadingResults: {
    alignItems: 'center',
    marginTop: 24,
  },

  root: {
    backgroundColor: Colors.BACKGROUND,
    flex: 1,
  },

  searchResults: {
    flex: 1,
  },

  searchResultsItem: {
    alignItems: 'center',
    backgroundColor: Colors.BACKGROUND_LIGHT,
    borderColor: Colors.BORDER_DARK,
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
