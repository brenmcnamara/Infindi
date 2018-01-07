/* @flow */

import Colors from './colors';

const header2 = {
  color: Colors.TEXT_NORMAL,
  fontFamily: 'Lato-Regular',
  fontSize: 22,
};

const header3 = {
  color: Colors.TEXT_NORMAL,
  fontFamily: 'Lato-Regular',
  fontSize: 18,
  lineHeight: 24,
};

// TODO: Rename to medium
const normal = {
  color: Colors.TEXT_NORMAL,
  fontFamily: 'Lato-Light',
  fontSize: 16,
  lineHeight: 22,
};

// TODO: Rename to mediumWithEmphasis.
const normalWithEmphasis = {
  ...normal,
  fontFamily: 'Lato-Regular',
};

const small = {
  color: Colors.TEXT_FAINT,
  fontFamily: 'Lato-Light',
  fontSize: 12,
  lineHeight: 22,
};

const smallWithEmphasis = {
  ...small,
  fontFamily: 'Lato-Regular',
};

const primary = {
  color: Colors.TEXT_PRIMARY,
  fontFamily: 'Lato-Regular',
  fontSize: 12,
  lineHeight: 22,
};

const error = {
  color: Colors.ERROR,
  fontFamily: 'Lato-Regular',
  fontSize: 16,
};

const bullet = {
  color: Colors.TEXT_NORMAL,
  fontFamily: 'Lato-Regular',
  fontSize: 40,
  lineHeight: 22,
};

const primaryButton = {
  color: Colors.TEXT_PRIMARY,
  fontFamily: 'Lato-Regular',
  lineHeight: 22,
};

const specialButton = {
  color: Colors.TEXT_SPECIAL,
  fontFamily: 'Lato-Regular',
  lineHeight: 22,
};

const normalButton = {
  color: Colors.TEXT_FAINT,
  fontFamily: 'Lato-Light',
  lineHeight: 22,
};

const largeFontSize = 18;

const mediumFontSize = 16;

const smallFontSize = 14;

export default {
  smallFontSize,
  mediumFontSize,
  largeFontSize,

  header2,
  header3,
  normal,
  normalWithEmphasis,
  small,
  smallWithEmphasis,
  primary,
  error,
  bullet,

  normalButton,
  primaryButton,
  specialButton,
};
