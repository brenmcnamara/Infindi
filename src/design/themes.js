/* @flow */

import Colors from './colors';

import invariant from 'invariant';

import type { BannerType } from '../banner/types';
import type { ID } from 'common/types/core';

export type Theme = Theme$Constants & Theme$Methods;

type Theme$Constants = {
  +color: {|
    +backgroundListItem: string,
    +backgroundMain: string,
    +backgroundTabBar: string,

    +bannerBackgroundAlert: string,
    +bannerBackgroundInfo: string,
    +bannerBackgroundSuccess: string,

    +bannerTextAlert: string,
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
    +textAlert: string,
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
    +tiny: number,
  |},

  +fontSize: {|
    +header2: number,
    +header3: number,

    +normal: number,
    +small: number,
    +tiny: number,
  |},

  +uniqueID: ID,
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
  +getTextStyleTiny: () => Object,
  +getTextStyleAlert: () => Object,
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
    getTextStyleTiny: getTextStyleTiny.bind(null, constants),
    getTextStyleAlert: getTextStyleAlert.bind(null, constants),
  };
}

function getBackgroundColorForBannerType(
  constants: Theme$Constants,
  bannerType: BannerType,
): string {
  switch (bannerType) {
    case 'ALERT':
      return constants.color.bannerBackgroundAlert;
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
    case 'ALERT':
      return constants.color.bannerTextAlert;
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

function getTextStyleTiny(constants: Theme$Constants): Object {
  return {
    color: constants.color.textNormal,
    fontFamily: constants.fontFamily.thin,
    fontSize: constants.fontSize.tiny,
    lineHeight: constants.fontLineHeight.tiny,
  };
}

function getTextStyleAlert(constants: Theme$Constants): Object {
  return {
    color: constants.color.textAlert,
    fontFamily: constants.fontFamily.thick,
    fontSize: constants.fontSize.normal,
    lineHeight: constants.fontLineHeight.normal,
  };
}

const Themes = {
  dark: createTheme({
    color: {
      backgroundListItem: '#455662',
      backgroundMain: '#232E35',
      backgroundTabBar: '#F6F6F6',

      bannerBackgroundAlert: Colors.RED,
      bannerBackgroundInfo: Colors.BLUE,
      bannerBackgroundSuccess: Colors.GREEN_DARK,

      bannerTextAlert: Colors.GRAY_EF,
      bannerTextInfo: Colors.GRAY_EF,
      bannerTextSuccess: Colors.GRAY_EF,

      borderDark: Colors.GRAY_CA,
      borderHairline: '#C4C4C4',
      borderNormal: '#4a5c66',

      buttonNavBar: Colors.BLACK,

      moneyTextNegative: Colors.RED,
      moneyTextNeutral: Colors.LYNCH,
      moneyTextPositive: Colors.GREEN,

      textDisabled: '#2D2D2D',
      textAlert: '#c76278',
      textFaint: '#657a87',
      textNormal: '#B3B3B3',
      textPrimary: '#4eccb8',
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
      tiny: 22,
    },

    fontSize: {
      header2: 22,
      header3: 18,

      normal: 16,
      small: 14,
      tiny: 12,
    },

    uniqueID: 'dark',
  }),

  light: createTheme({
    color: {
      backgroundListItem: Colors.WHITE,
      backgroundMain: Colors.GRAY_EF,
      backgroundTabBar: '#F6F6F6',

      bannerBackgroundAlert: Colors.RED,
      bannerBackgroundInfo: Colors.BLUE,
      bannerBackgroundSuccess: Colors.GREEN_DARK,

      bannerTextAlert: Colors.GRAY_EF,
      bannerTextInfo: Colors.GRAY_EF,
      bannerTextSuccess: Colors.GRAY_EF,

      borderDark: Colors.GRAY_CA,
      borderHairline: '#C4C4C4',
      borderNormal: Colors.GRAY_DC,

      buttonNavBar: Colors.BLACK,

      moneyTextNegative: Colors.RED,
      moneyTextNeutral: Colors.LYNCH,
      moneyTextPositive: Colors.GREEN,

      textDisabled: Colors.GRAY_CA,
      textAlert: Colors.ALERT,
      textFaint: Colors.GRAY_9B,
      textNormal: Colors.GRAY_4A,
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
      tiny: 22,
    },

    fontSize: {
      header2: 22,
      header3: 18,

      normal: 16,
      small: 14,
      tiny: 12,
    },

    uniqueID: 'light',
  }),

  lightInverted: createTheme({
    color: {
      backgroundListItem: '#F4F4F4',
      backgroundMain: '#FFFFFF',
      backgroundTabBar: '#F6F6F6',

      bannerBackgroundAlert: Colors.RED,
      bannerBackgroundInfo: Colors.BLUE,
      bannerBackgroundSuccess: Colors.GREEN_DARK,

      bannerTextAlert: Colors.GRAY_EF,
      bannerTextInfo: Colors.GRAY_EF,
      bannerTextSuccess: Colors.GRAY_EF,

      borderDark: Colors.GRAY_CA,
      borderHairline: '#C4C4C4',
      borderNormal: '#CCCCCC',

      buttonNavBar: Colors.BLACK,

      moneyTextNegative: Colors.RED,
      moneyTextNeutral: Colors.LYNCH,
      moneyTextPositive: Colors.GREEN_DARK,

      textDisabled: Colors.GRAY_CA,
      textAlert: Colors.ALERT,
      textFaint: Colors.GRAY_9B,
      textNormal: Colors.GRAY_4A,
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
      tiny: 22,
    },

    fontSize: {
      header2: 22,
      header3: 18,

      normal: 16,
      small: 14,
      tiny: 12,
    },

    uniqueID: 'lightInverted',
  }),
};

export default Themes;
export type ThemeName = $Keys<typeof Themes>;
