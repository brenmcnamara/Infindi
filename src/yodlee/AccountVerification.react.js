/* @flow */

import Colors from '../design/colors';
import Content from '../components/shared/Content.react';
import FooterWithButtons from '../components/shared/FooterWithButtons.react';
import Icons from '../design/icons';
import React, { Component } from 'react';
import TextDesign from '../design/text';
import Screen from '../components/shared/Screen.react';

import {
  Animated,
  Easing,
  FlatList,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { dismissAccountVerification } from './action';
import { NavBarHeight } from '../design/layout';

import type { ComponentType } from 'react';
import type { Provider as YodleeProvider } from 'common/lib/models/YodleeProvider';
import type { ReduxProps } from '../typesDEPRECATED/redux';

export type ComponentProps = {
  show: bool,
};

export type ReduxStateProps = {};

export type Props = ReduxProps & ReduxStateProps & ComponentProps;

type State = {
  // TODO: Provider type is not correct.
  providers: Array<Object>,
  search: string,
};

export const TransitionInMillis = 400;
export const TransitionOutMillis = 400;

class AccountVerification extends Component<Props, State> {
  _transitionValue: Animated.Value;

  constructor(props: Props) {
    super(props);
    this._transitionValue = new Animated.Value(props.show ? 1.0 : 0.0);
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

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.show === this.props.show) {
      return;
    }
    Animated.timing(this._transitionValue, {
      duration: nextProps.show ? TransitionInMillis : TransitionOutMillis,
      easing: Easing.out(Easing.cubic),
      toValue: nextProps.show ? 1.0 : 0.0,
    }).start();
    if (nextProps.show) {
      this.refs.searchInput.focus();
      // this.refs.searchTextInput.blur();
    }
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
                {this._renderSearch()}
                {this._renderSearchResults()}
              </Content>
              <FooterWithButtons
                buttonLayout={{ type: 'CENTER', centerButtonText: 'CANCEL' }}
                onPress={this._onFooterButtonPress}
              />
            </Screen>
          </SafeAreaView>
        </Animated.View>
      </KeyboardAvoidingView>
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
          editable={this.props.show}
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
      <View style={itemStyles}>
        <View style={styles.searchResultsItemContent}>
          <Text style={nameStyles}>{item.raw.name}</Text>
          <Text style={TextDesign.small}>{item.raw.baseUrl}</Text>
        </View>
      </View>
    );
  };

  _onChangeSearchText = (text: string): void => {
    this.setState({ search: text });
  };

  _onFooterButtonPress = (button: 'LEFT' | 'RIGHT' | 'CENTER'): void => {
    if (this._isCancelButton(button)) {
      this.props.dispatch(dismissAccountVerification());
    }
  };

  _onPressBackground = (): void => {};

  _isCancelButton(button: 'LEFT' | 'RIGHT' | 'CENTER') {
    return button === 'CENTER' || button === 'LEFT';
  }
}

export default (connect()(AccountVerification): ComponentType<ComponentProps>);

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.BACKGROUND,
    flex: 1,
  },

  safeArea: {
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
    borderColor: Colors.BORDER,
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
