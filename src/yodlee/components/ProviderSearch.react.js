/* @flow */

import Colors from '../../design/colors';
import Icons from '../../design/icons';
import React, { Component } from 'react';
import TextDesign from '../../design/text';

import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { isSupportedProvider } from '../utils';
import { NavBarHeight } from '../../design/layout';

import type { Provider as YodleeProvider } from 'common/lib/models/YodleeProvider';

export type Props = {
  isEditable: bool,
  onChangeSearch: (search: string) => any,
  onSelectProvider: (provider: YodleeProvider) => any,
  providers: Array<YodleeProvider>,
  search: string,
};

export default class ProviderSearch extends Component<Props> {
  _transitionValue: Animated.Value;

  render() {
    return (
      <View style={styles.root}>
        {this._renderSearch()}
        {this._renderSearchResults()}
      </View>
    );
  }

  _renderSearch() {
    return (
      <View style={styles.search}>
        <Image
          resizeMode="contain"
          source={Icons.Search}
          style={styles.searchIcon}
        />
        <TextInput
          editable={this.props.isEditable}
          onChangeText={this.props.onChangeSearch}
          placeholder="Search for Institutions..."
          ref="searchInput"
          selectTextOnFocus={true}
          spellCheck={false}
          style={styles.searchTextInput}
          value={this.props.search}
        />
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

  search: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.BORDER_HAIRLINE,
    flexDirection: 'row',
    // Add 1 since hairline border is not inclusive of width in normal nav bar.
    height: NavBarHeight + 1,
  },

  searchIcon: {
    marginLeft: 16,
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
    borderRadius: 5,
    height: 10,
    margin: 4,
    width: 10,
  },

  searchTextInput: {
    fontFamily: TextDesign.thickFont,
    fontSize: TextDesign.largeFontSize,
    marginLeft: 16,
  },
});
