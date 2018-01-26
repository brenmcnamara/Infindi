/* @flow */

import Colors from '../design/colors';
import Icons from '../design/icons';
import React, { Component } from 'react';
import TextDesign from '../design/text';

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
import { NavBarHeight } from '../design/layout';

import type { Provider as YodleeProvider } from 'common/lib/models/YodleeProvider';

export type Props = {
  isEditable: bool,
  onSelectProvider: (provider: YodleeProvider) => any,
};

type State = {
  // TODO: Provider type is not correct.
  providers: Array<Object>,
  search: string,
};

export default class ProviderSearch extends Component<Props, State> {
  _transitionValue: Animated.Value;

  constructor(props: Props) {
    super(props);
    this.state = {
      providers: [
        {
          type: 'MODEL',
          isDeprecated: false,
          id: '643',
          createdAt: new Date(Date.parse('2018-01-16T00:58:03.772Z')),
          updatedAt: new Date(Date.parse('2018-01-16T00:58:03.772Z')),
          raw: {
            PRIORITY: 'COBRAND',
            status: 'Supported',
            additionalDataSet: [
              {
                attribute: [
                  {
                    name: 'FULL_ACCT_NUMBER',
                    container: ['bank'],
                  },
                  {
                    name: 'BANK_TRANSFER_CODE',
                    container: ['bank'],
                  },
                  {
                    name: 'HOLDER_NAME',
                    container: ['bank'],
                  },
                ],
                name: 'ACCT_PROFILE',
              },
            ],
            lastModified: '2018-01-04T05:57:54Z',
            name: 'Chase',
            containerAttributes: {
              CREDITCARD: {
                numberOfTransactionDays: 90,
              },
              BANK: {
                numberOfTransactionDays: 365,
              },
              INVESTMENT: {
                numberOfTransactionDays: 365,
              },
              REWARD: {
                numberOfTransactionDays: 90,
              },
              LOAN: {
                numberOfTransactionDays: 90,
              },
            },
            id: 643,
            countryISOCode: 'US',
            languageISOCode: 'EN',
            containerNames: [
              'creditCard',
              'reward',
              'bank',
              'loan',
              'investment',
            ],
            oAuthSite: false,
            loginUrl: 'https://chaseonline.chase.com/Logon.aspx?LOB=Yodlee',
            isAutoRefreshEnabled: true,
            favicon: 'http://yodlee.vo.llnwd.net/v1/FAVICON/FAV_643.SVG',
            primaryLanguageISOCode: 'EN',
            baseUrl: 'https://www.chase.com/',
            logo: 'http://yodlee.vo.llnwd.net/v1/LOGO/LOGO_643_1_2.SVG',
            authType: 'CREDENTIALS',
            forgetPasswordUrl:
              'https://chaseonline.chase.com/Public/ReIdentify/ReidentifyFilterView.aspx?COLLogon',
          },
          modelType: 'YodleeProvider',
          objectID: '643',
          _highlightResult: {
            raw: {
              name: {
                value: '<em>Chase</em>',
                matchLevel: 'full',
                fullyHighlighted: true,
                matchedWords: ['chase'],
              },
              loginUrl: {
                value:
                  'https://<em>chase</em>online.<em>chase</em>.com/Logon.aspx?LOB=Yodlee',
                matchLevel: 'full',
                fullyHighlighted: false,
                matchedWords: ['chase'],
              },
            },
          },
        },
        {
          isDeprecated: false,
          id: '9752',
          createdAt: new Date(Date.parse('2018-01-16T00:59:49.148Z')),
          updatedAt: new Date(Date.parse('2018-01-16T00:59:49.148Z')),
          raw: {
            logo: 'http://yodlee.vo.llnwd.net/v1/LOGO/LOGO_9752_1_2.SVG',
            authType: 'CREDENTIALS',
            PRIORITY: 'COBRAND',
            status: 'Supported',
            lastModified: '2016-12-30T10:17:42Z',
            name: 'Chase Insurance Service Center',
            containerAttributes: {
              INVESTMENT: {
                numberOfTransactionDays: 90,
              },
            },
            id: 9752,
            containerNames: ['investment'],
            countryISOCode: 'US',
            languageISOCode: 'EN',
            oAuthSite: false,
            loginUrl: 'http://insuranceservices.se2.com/',
            isAutoRefreshEnabled: true,
            favicon: 'http://yodlee.vo.llnwd.net/v1/FAVICON/FAV_9752.PNG',
            primaryLanguageISOCode: 'EN',
            baseUrl: 'https://insuranceservices.se2.com/#33',
          },
          modelType: 'YodleeProvider',
          type: 'MODEL',
          objectID: '9752',
          _highlightResult: {
            raw: {
              name: {
                value: '<em>Chase</em> Insurance Service Center',
                matchLevel: 'full',
                fullyHighlighted: false,
                matchedWords: ['chase'],
              },
              loginUrl: {
                value: 'http://insuranceservices.se2.com/',
                matchLevel: 'none',
                matchedWords: [],
              },
            },
          },
        },
        {
          createdAt: new Date(Date.parse('2018-01-16T00:58:03.772Z')),
          updatedAt: new Date(Date.parse('2018-01-16T00:58:03.772Z')),
          raw: {
            authType: 'CREDENTIALS',
            forgetPasswordUrl:
              'https://www.myaccountaccess.com/onlineCard/publicRetrieveLoginId.do',
            PRIORITY: 'COBRAND',
            status: 'Supported',
            lastModified: '2017-10-26T05:38:55Z',
            name: 'Chase Cards (formerly FirstUSA)',
            containerAttributes: {
              CREDITCARD: {
                numberOfTransactionDays: 90,
              },
            },
            id: 39,
            countryISOCode: 'US',
            languageISOCode: 'EN',
            containerNames: ['creditCard'],
            oAuthSite: false,
            loginUrl:
              'https://chaseonline.chase.com/chaseonline/logon/sso_logon.jsp?LOB=Yodlee',
            isAutoRefreshEnabled: true,
            favicon: 'http://yodlee.vo.llnwd.net/v1/FAVICON/FAV_39.PNG',
            primaryLanguageISOCode: 'EN',
            baseUrl: 'https://www.chase.com/',
            logo: 'http://yodlee.vo.llnwd.net/v1/LOGO/LOGO_39_1_2.SVG',
          },
          modelType: 'YodleeProvider',
          type: 'MODEL',
          isDeprecated: false,
          id: '39',
          objectID: '39',
          _highlightResult: {
            raw: {
              name: {
                value: '<em>Chase</em> Cards (formerly FirstUSA)',
                matchLevel: 'full',
                fullyHighlighted: false,
                matchedWords: ['chase'],
              },
              loginUrl: {
                value:
                  // eslint-disable-next-line max-len
                  'https://<em>chase</em>online.<em>chase</em>.com/<em>chase</em>online/logon/sso_logon.jsp?LOB=Yodlee',
                matchLevel: 'full',
                fullyHighlighted: false,
                matchedWords: ['chase'],
              },
            },
          },
        },
      ],
      search: '',
    };
  }

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
          autoFocus={true}
          editable={this.props.isEditable}
          onChangeText={this._onChangeSearchText}
          placeholder="Search for Institutions..."
          ref="searchInput"
          selectTextOnFocus={true}
          spellCheck={false}
          style={styles.searchTextInput}
          value={this.state.search}
        />
      </View>
    );
  }

  _renderSearchResults() {
    return (
      <View style={styles.searchResults}>
        <FlatList
          data={this.state.providers}
          keyExtractor={provider => provider.id}
          renderItem={this._renderProvider}
        />
      </View>
    );
  }

  _renderProvider = ({ item }: { item: YodleeProvider }) => {
    const isFirst = this.state.providers[0] === item;
    const itemStyles = [
      styles.searchResultsItem,
      isFirst ? { marginTop: 4 } : null,
    ];
    const nameStyles = [TextDesign.header3, styles.searchResultsItemName];
    return (
      <TouchableOpacity onPress={() => this._onSelectProvider(item)}>
        <View style={itemStyles}>
          <View style={styles.searchResultsItemContent}>
            <Text style={nameStyles}>{item.raw.name}</Text>
            {/* $FlowFixMe - YodleeType defined wrong */}
            <Text style={TextDesign.small}>{item.raw.baseUrl}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _onChangeSearchText = (text: string): void => {
    this.setState({ search: text });
  };

  _onSelectProvider = (provider: YodleeProvider): void => {};
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

  searchTextInput: {
    fontFamily: TextDesign.thickFont,
    fontSize: TextDesign.largeFontSize,
    marginLeft: 16,
  },
});
