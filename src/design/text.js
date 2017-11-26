/* @flow */

import Colors from './colors';

const header3 = {
  fontFamily: 'Lato-Regular',
  fontSize: 18,
  color: 'black',
};

const normal = {
  fontFamily: 'Lato-Light',
  fontSize: 16,
  color: 'black',
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

  header3,
  normal,
  error,

  normalButton,
  primaryButton,
  specialButton,
};
