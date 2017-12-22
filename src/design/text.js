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

const error = {
  fontFamily: 'Lato-Regular',
  fontSize: 16,
  color: Colors.ERROR,
};

const primaryButton = {
  fontFamily: 'Lato-Regular',
  color: Colors.TEXT_PRIMARY,
};

const specialButton = {
  fontFamily: 'Lato-Regular',
  color: Colors.TEXT_SPECIAL,
};

const normalButton = {
  fontFamily: 'Lato-Light',
  color: Colors.TEXT_FAINT,
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
  error,

  normalButton,
  primaryButton,
  specialButton,
};
