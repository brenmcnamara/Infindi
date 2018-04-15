/* @flow */

const BLACK = '#000000';
const BLUE = '#6290C6';
const BLUE_DARK = '#5F86AE';
const GRAY_1 = '#EFEFEF';
const GRAY_2 = '#DCDBDB';
const GRAY_3 = '#CACACA';
const GRAY_4 = '#9B9B9B';
const GRAY_5 = '#4A4A4A';
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
  GRAY_1,
  GRAY_2,
  GRAY_3,
  GRAY_4,
  GRAY_5,
  GREEN,
  GREEN_DARK,
  GREEN_LIGHT,
  RED,
  WHITE,
  LYNCH,

  // TODO: Rename to BACKGROUND_NORMAL
  BACKGROUND: GRAY_1,
  BACKGROUND_LIGHT: WHITE,
  BACKGROUND_ACTION_ITEM_BANNER_ACTIVE: GRAY_1,
  BACKGROUND_ACTION_ITEM_BANNER_INACTIVE: WHITE,
  BANNER_BACKGROUND: {
    ERROR: RED,
    INFO: BLUE,
    SUCCESS: GREEN_DARK,
  },
  BANNER_LINE_ANIMATION: BLUE_DARK,
  BANNER_TEXT: {
    ERROR: GRAY_1,
    INFO: GRAY_1,
    SUCCESS: GRAY_1,
  },
  BORDER: GRAY_2,
  BORDER_DARK: GRAY_3,
  // TODO: This is my best guess of the default nav bar hairline color. Should
  // figure out what the color actually is.
  BORDER_HAIRLINE: '#C4C4C4',
  ERROR: RED,
  MONEY_GOOD: GREEN_DARK,
  MONEY_NEUTRAL: LYNCH,
  NAV_BAR_BUTTON: BLACK,
  SUCCESS: GREEN,
  TAB_BAR: '#F6F6F6',
  TEXT_FAINT: GRAY_4,
  TEXT_NORMAL: GRAY_5,
  TEXT_PRIMARY: GREEN_DARK,
  TEXT_PRIMARY_DISABLED: GREEN_LIGHT,
  TEXT_SPECIAL: BLUE,
  TEXT_STRONG: BLACK,
};
