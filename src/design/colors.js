/* @flow */

const BLACK = '#000000';
const BLUE = '#6290C6';
const GRAY_1 = '#EFEFEF';
const GRAY_2 = '#DCDBDB';
const GRAY_3 = '#9B9B9B';
const GRAY_4 = '#4A4A4A';
const GREEN = '#3BA68E';
const RED = '#B54C59';
const WHITE = '#FFFFFF';

export default {
  // TODO: Rename to BACKGROUND_NORMAL
  BACKGROUND: GRAY_1,
  BACKGROUND_LIGHT: WHITE,
  BACKGROUND_ACTION_ITEM_BANNER_ACTIVE: GRAY_1,
  BACKGROUND_ACTION_ITEM_BANNER_INACTIVE: WHITE,
  BANNER_BACKGROUND: {
    ERROR: RED,
    INFO: BLUE,
  },
  BANNER_TEXT: {
    ERROR: GRAY_1,
    INFO: GRAY_1,
  },
  BORDER: GRAY_2,
  // TODO: This is my best guess of the default nav bar hairline color. Should
  // figure out what the color actually is.
  BORDER_HAIRLINE: '#C4C4C4',
  ERROR: RED,
  MONEY_GOOD: GREEN,
  NAV_BAR_BUTTON: BLACK,
  TAB_BAR: '#F6F6F6',
  TEXT_FAINT: GRAY_3,
  TEXT_NORMAL: GRAY_4,
  TEXT_PRIMARY: GREEN,
  TEXT_SPECIAL: BLUE,
  TEXT_STRONG: BLACK,
};
