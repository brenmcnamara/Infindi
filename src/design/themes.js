/* @flow */

import Colors from './colors';

import invariant from 'invariant';

import type { BannerType } from '../reducers/toast';

export type Theme = Theme$Constants & Theme$Methods;

type Theme$Constants = {
  +color: {|
    +backgroundApp: string,
    +backgroundListItem: string,
    +backgroundTabBar: string,

    +bannerBackgroundError: string,
    +bannerBackgroundInfo: string,
    +bannerBackgroundSuccess: string,

    +bannerTextError: string,
    +bannerTextInfo: string,
    +bannerTextSuccess: string,

    +borderDark: string,
    +borderHairline: string,
    +borderNormal: string,

    +buttonNavBar: string,

    +moneyTextNegative: string,
    +moneyTextNeutral: string,
    +moneyTextPositive: string,

    +textDisabled: string,
    +textError: string,
    +textFaint: string,
    +textNormal: string,
    +textPrimary: string,
    +textPrimaryDisabled: string,
    +textSpecial: string,
  |},

  +fontFamily: {|
    +thick: string,
    +thin: string,
  |},

  +fontLineHeight: {|
    +header2: number,
    +header3: number,

    +normal: number,
    +small: number,
  |},

  +fontSize: {|
    +header2: number,
    +header3: number,

    +normal: number,
    +small: number,
  |},
};

type Theme$Methods = {
  +getBackgroundColorForBannerType: (bannerType: BannerType) => string,
  +getTextColorForBannerType: (bannerType: BannerType) => string,

  +getTextStyleHeader2: () => Object,
  +getTextStyleHeader3: () => Object,
  +getTextStyleNormal: () => Object,
  +getTextStyleNormalWithEmphasis: () => Object,
  +getTextStyleSmall: () => Object,
  +getTextStyleSmallWithEmphasis: () => Object,
  +getTextStyleError: () => Object,
};

function createTheme(constants: Theme$Constants): Theme {
  return {
    ...constants,

    getBackgroundColorForBannerType: getBackgroundColorForBannerType.bind(
      null,
      constants,
    ),
    getTextColorForBannerType: getTextColorForBannerType.bind(null, constants),

    getTextStyleHeader2: getTextStyleHeader2.bind(null, constants),
    getTextStyleHeader3: getTextStyleHeader3.bind(null, constants),
    getTextStyleNormal: getTextStyleNormal.bind(null, constants),
    getTextStyleNormalWithEmphasis: getTextStyleNormalWithEmphasis.bind(
      null,
      constants,
    ),
    getTextStyleSmall: getTextStyleSmall.bind(null, constants),
    getTextStyleSmallWithEmphasis: getTextStyleSmallWithEmphasis.bind(
      null,
      constants,
    ),
    getTextStyleError: getTextStyleError.bind(null, constants),
  };
}

function getBackgroundColorForBannerType(
  constants: Theme$Constants,
  bannerType: BannerType,
): string {
  switch (bannerType) {
    case 'ERROR':
      return constants.color.bannerBackgroundError;
    case 'INFO':
      return constants.color.bannerBackgroundInfo;
    case 'SUCCESS':
      return constants.color.bannerBackgroundSuccess;
    default:
      return invariant(false, 'Unrecognized banner type: %s', bannerType);
  }
}

function getTextColorForBannerType(
  constants: Theme$Constants,
  bannerType: BannerType,
): string {
  switch (bannerType) {
    case 'ERROR':
      return constants.color.bannerTextError;
    case 'INFO':
      return constants.color.bannerTextInfo;
    case 'SUCCESS':
      return constants.color.bannerTextSuccess;
    default:
      return invariant(false, 'Unrecognized bannner type: %s', bannerType);
  }
}

function getTextStyleHeader2(constants: Theme$Constants): Object {
  return {
    color: constants.color.textNormal,
    fontFamily: constants.fontFamily.thick,
    fontSize: constants.fontSize.header2,
    lineHeight: constants.fontLineHeight.header2,
  };
}

function getTextStyleHeader3(constants: Theme$Constants): Object {
  return {
    color: constants.color.textNormal,
    fontFamily: constants.fontFamily.thick,
    fontSize: constants.fontSize.header3,
    lineHeight: constants.fontLineHeight.header3,
  };
}

function getTextStyleNormal(constants: Theme$Constants): Object {
  return {
    color: constants.color.textNormal,
    fontFamily: constants.fontFamily.thin,
    fontSize: constants.fontSize.normal,
    lineHeight: constants.fontLineHeight.normal,
  };
}

function getTextStyleNormalWithEmphasis(constants: Theme$Constants): Object {
  return {
    color: constants.color.textNormal,
    fontFamily: constants.fontFamily.thick,
    fontSize: constants.fontSize.normal,
    lineHeight: constants.fontLineHeight.normal,
  };
}

function getTextStyleSmall(constants: Theme$Constants): Object {
  return {
    color: constants.color.textNormal,
    fontFamily: constants.fontFamily.thin,
    fontSize: constants.fontSize.small,
    lineHeight: constants.fontLineHeight.small,
  };
}

function getTextStyleSmallWithEmphasis(constants: Theme$Constants): Object {
  return {
    color: constants.color.textNormal,
    fontFamily: constants.fontFamily.thick,
    fontSize: constants.fontSize.small,
    lineHeight: constants.fontLineHeight.small,
  };
}

function getTextStyleError(constants: Theme$Constants): Object {
  return {
    color: constants.color.textError,
    fontFamily: constants.fontFamily.thick,
    fontSize: constants.fontSize.normal,
    lineHeight: constants.fontLineHeight.normal,
  };
}

const Themes = {
  primary: createTheme({
    color: {
      backgroundApp: Colors.GRAY_1,
      backgroundListItem: Colors.WHITE,
      backgroundTabBar: '#F6F6F6',

      bannerBackgroundError: Colors.RED,
      bannerBackgroundInfo: Colors.BLUE,
      bannerBackgroundSuccess: Colors.GREEN_DARK,

      bannerTextError: Colors.GRAY_1,
      bannerTextInfo: Colors.GRAY_1,
      bannerTextSuccess: Colors.GRAY_1,

      borderDark: Colors.GRAY_3,
      borderHairline: '#C4C4C4',
      borderNormal: Colors.GRAY_2,

      buttonNavBar: Colors.BLACK,

      moneyTextNegative: Colors.RED,
      moneyTextNeutral: Colors.LYNCH,
      moneyTextPositive: Colors.GREEN,

      textDisabled: Colors.GRAY_3,
      textError: Colors.ERROR,
      textFaint: Colors.GRAY_4,
      textNormal: Colors.GRAY_5,
      textPrimary: Colors.GREEN_DARK,
      textPrimaryDisabled: Colors.GREEN_LIGHT,
      textSpecial: Colors.BLUE,
    },

    fontFamily: {
      thin: 'Lato-Light',
      thick: 'Lato-Regular',
    },

    fontLineHeight: {
      header2: 26,
      header3: 24,

      normal: 22,
      small: 22,
    },

    fontSize: {
      header2: 22,
      header3: 18,

      normal: 16,
      small: 14,
    },
  }),
};

export default Themes;
export type ThemeName = $Keys<typeof Themes>;
