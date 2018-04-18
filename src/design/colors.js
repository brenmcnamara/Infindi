/* @flow */

const BLACK = '#000000';
const BLUE = '#6290C6';
const BLUE_DARK = '#5F86AE';
const GRAY_EF = '#EFEFEF';
const GRAY_DC = '#DCDCDC';
const GRAY_CA = '#CACACA';
const GRAY_9B = '#9B9B9B';
const GRAY_4A = '#4A4A4A';
const GRAY_1C = '#1C1C1C';
const GREEN = '#3BA68E';
const GREEN_DARK = '#24826D';
const GREEN_LIGHT = '#B2CDC7';
const RED = '#B54C59';
const WHITE = '#FFFFFF';
const LYNCH = '#6C7A89';

export default {
  BLACK,
  BLUE,
  BLUE_DARK,
  GRAY_EF,
  GRAY_DC,
  GRAY_CA,
  GRAY_9B,
  GRAY_4A,
  GRAY_1C,
  GREEN,
  GREEN_DARK,
  GREEN_LIGHT,
  RED,
  WHITE,
  LYNCH,

  // TODO: Rename to BACKGROUND_NORMAL
  BACKGROUND: GRAY_EF,
  BACKGROUND_LIGHT: WHITE,
  BACKGROUND_ACTION_ITEM_BANNER_ACTIVE: GRAY_EF,
  BACKGROUND_ACTION_ITEM_BANNER_INACTIVE: WHITE,
  BANNER_BACKGROUND: {
    ERROR: RED,
    INFO: BLUE,
    SUCCESS: GREEN_DARK,
  },
  BANNER_LINE_ANIMATION: BLUE_DARK,
  BANNER_TEXT: {
    ERROR: GRAY_EF,
    INFO: GRAY_EF,
    SUCCESS: GRAY_EF,
  },
  BORDER: GRAY_DC,
  BORDER_DARK: GRAY_CA,
  // TODO: This is my best guess of the default nav bar hairline color. Should
  // figure out what the color actually is.
  BORDER_HAIRLINE: '#C4C4C4',
  ERROR: RED,
  MONEY_GOOD: GREEN_DARK,
  MONEY_NEUTRAL: LYNCH,
  NAV_BAR_BUTTON: BLACK,
  SUCCESS: GREEN,
  TAB_BAR: '#F6F6F6',
  TEXT_FAINT: GRAY_9B,
  TEXT_NORMAL: GRAY_4A,
  TEXT_PRIMARY: GREEN_DARK,
  TEXT_PRIMARY_DISABLED: GREEN_LIGHT,
  TEXT_SPECIAL: BLUE,
  TEXT_STRONG: BLACK,
};
