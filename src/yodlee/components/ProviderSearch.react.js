/* @flow */

import Colors from '../../design/colors';
import React, { Component } from 'react';
import TextDesign from '../../design/text';

import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { isSupportedProvider } from '../utils';

import type { Provider as YodleeProvider } from 'common/lib/models/YodleeProvider';

export type Props = {
  isEditable: bool,
  onSelectProvider: (provider: YodleeProvider) => any,
  providers: Array<YodleeProvider>,
  search: string,
};

const SUPPORT_INDICATOR_SIZE = 6;

export default class ProviderSearch extends Component<Props> {
  _transitionValue: Animated.Value;

  render() {
    return <View style={styles.root}>{this._renderSearchResults()}</View>;
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

  _renderProvider = ({ item }: { item: YodleeProvider }) => {
    const isFirst = this.props.providers[0] === item;
    const itemStyles = [
      styles.searchResultsItem,
      isFirst ? { marginTop: 4 } : null,
    ];
    const nameStyles = [TextDesign.header3, styles.searchResultsItemName];
    const support = isSupportedProvider(item);
    const supportStyles = [
      styles.searchResultItemSupport,
      {
        backgroundColor: support.type === 'YES' ? Colors.SUCCESS : Colors.ERROR,
      },
    ];

    return (
      <TouchableOpacity onPress={() => this.props.onSelectProvider(item)}>
        <View style={itemStyles}>
          <View style={styles.searchResultsItemContent}>
            <Text style={nameStyles}>{item.raw.name}</Text>
            {/* $FlowFixMe - YodleeType defined wrong */}
            <Text style={TextDesign.small}>{item.raw.baseUrl}</Text>
          </View>
          <View style={supportStyles} />
        </View>
      </TouchableOpacity>
    );
  };
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.BACKGROUND,
    flex: 1,
  },

  searchResults: {
    flex: 1,
  },

  searchResultsItem: {
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

  searchResultItemSupport: {
    borderRadius: SUPPORT_INDICATOR_SIZE / 2,
    height: SUPPORT_INDICATOR_SIZE,
    width: SUPPORT_INDICATOR_SIZE,
  },
});
