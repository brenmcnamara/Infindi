/* @flow */

import Colors from './colors';

const thinFont = 'Lato-Light';
const thickFont = 'Lato-Regular';

const header2 = {
  color: Colors.TEXT_NORMAL,
  fontFamily: thickFont,
  fontSize: 22,
};

const header3 = {
  color: Colors.TEXT_NORMAL,
  fontFamily: thickFont,
  fontSize: 18,
  lineHeight: 24,
};

// TODO: Rename to medium
const normal = {
  color: Colors.TEXT_NORMAL,
  fontFamily: thinFont,
  fontSize: 16,
  lineHeight: 22,
};

// TODO: Rename to mediumWithEmphasis.
const normalWithEmphasis = {
  ...normal,
  fontFamily: thickFont,
};

// TODO: Rename to mediumWithCriticalEmphasis
const normalWithCriticalEmphasis = {
  ...normal,
  color: Colors.ERROR,
  fontFamily: thickFont,
};

const small = {
  color: Colors.TEXT_FAINT,
  fontFamily: thinFont,
  fontSize: 14,
  lineHeight: 22,
};

const smallWithEmphasis = {
  ...small,
  fontFamily: thickFont,
};

const primary = {
  color: Colors.TEXT_PRIMARY,
  fontFamily: thickFont,
  fontSize: 12,
  lineHeight: 22,
};

const error = {
  color: Colors.ERROR,
  fontFamily: thickFont,
  fontSize: 16,
};

const bullet = {
  color: Colors.TEXT_NORMAL,
  fontFamily: thickFont,
  fontSize: 40,
  lineHeight: 22,
};

const primaryButton = {
  color: Colors.TEXT_PRIMARY,
  fontFamily: thickFont,
  lineHeight: 22,
};

const primaryButtonDisabled = {
  ...primaryButton,
  color: Colors.TEXT_PRIMARY_DISABLED,
};

const specialButton = {
  color: Colors.TEXT_SPECIAL,
  fontFamily: thickFont,
  lineHeight: 22,
};

const normalButton = {
  color: Colors.TEXT_FAINT,
  fontFamily: thinFont,
  lineHeight: 22,
};

const largeFontSize = 18;

const mediumFontSize = 16;

const smallFontSize = 14;

export default {
  thinFont,
  thickFont,

  smallFontSize,
  mediumFontSize,
  largeFontSize,

  header2,
  header3,
  normal,
  normalWithEmphasis,
  normalWithCriticalEmphasis,
  small,
  smallWithEmphasis,
  primary,
  error,
  bullet,

  normalButton,
  primaryButton,
  primaryButtonDisabled,
  specialButton,
};
