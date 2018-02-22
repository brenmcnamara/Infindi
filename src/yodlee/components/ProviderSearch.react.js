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
import { isInProgress } from 'common/lib/models/RefreshInfo';

import type { ModelCollection } from '../../datastore';
import type { Provider } from 'common/lib/models/Provider';
import type { RefreshInfo } from 'common/lib/models/RefreshInfo';

export type Props = {
  didCompleteInitialSearch: bool,
  isEditable: bool,
  onSelectProvider: (provider: Provider) => any,
  providers: Array<Provider>,
  refreshInfoCollection: RefreshInfoCollection,
  search: string,
};

type RefreshInfoCollection = ModelCollection<'RefreshInfo', RefreshInfo>;

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
    const refreshInfo = this._getRefreshInfoForProvider(item);
    const providerName = yodleeProvider.name;
    const baseURL = yodleeProvider.baseUrl;
    return (
      <TouchableOpacity onPress={() => this.props.onSelectProvider(item)}>
        <View style={itemStyles}>
          <View style={styles.searchResultsItemContent}>
            <Text style={nameStyles}>{providerName}</Text>
            <Text style={TextDesign.small}>{baseURL}</Text>
          </View>
          {refreshInfo && isInProgress(refreshInfo) ? <Downloading /> : null}
        </View>
      </TouchableOpacity>
    );
  };

  _getRefreshInfoForProvider(provider: Provider): RefreshInfo | null {
    const collection = this.props.refreshInfoCollection;
    for (const id in collection) {
      if (
        collection.hasOwnProperty(id) &&
        collection[id].providerRef.refID === provider.id
      ) {
        return collection[id];
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
