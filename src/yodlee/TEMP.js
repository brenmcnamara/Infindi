/* @flow */

export default [
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
      containerNames: ['creditCard', 'reward', 'bank', 'loan', 'investment'],
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
];
