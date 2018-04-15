/* @flow */

import React, { Component } from 'react';
import Themes from '../../design/themes';

import { Text } from 'react-native';

import type { Dollars } from 'common/types/core';

export type Props = {
  dollars: Dollars,
  // NOTE: Color styling will be overridden.
  textStyle: any,
};

export default class MoneyText extends Component<Props> {
  render() {
    const theme = Themes.primary;
    const style = [
      this.props.textStyle,
      {
        color:
          this.props.dollars > 0
            ? theme.color.moneyTextPositive
            : theme.color.moneyTextNeutral,
      },
    ];
    return <Text style={style}>{this._getDollarsFormatted()}</Text>;
  }

  _getDollarsFormatted(): string {
    let roundDollarsTimes100 = Math.round(Math.abs(this.props.dollars) * 100);
    const sign = this.props.dollars < 0 ? '-' : '';
    const digits = [];
    while (roundDollarsTimes100 > 0) {
      const nextDigit = roundDollarsTimes100 % 10;
      roundDollarsTimes100 = Math.floor(roundDollarsTimes100 / 10);
      digits.push(nextDigit);
    }

    if (digits.length === 0) {
      return `${sign}$0`;
    } else if (digits.length === 1) {
      return `${sign}$0.0${digits[0]}`;
    }

    // Start with the stuff after the decimal point.
    let formatted = `.${digits[1]}${digits[0]}`;

    if (digits.length <= 2) {
      return `${sign}$0${formatted}`;
    }

    let isFirstPass = true;
    for (let i = 2; i < digits.length; i += 3) {
      const d1 = digits[i].toString();
      const d2 = i + 1 < digits.length ? digits[i + 1].toString() : '';
      const d3 = i + 2 < digits.length ? digits[i + 2].toString() : '';
      const comma = isFirstPass ? '' : ',';
      formatted = `${d3}${d2}${d1}${comma}` + formatted;
      isFirstPass = false;
    }
    return `${sign}$${formatted}`;
  }
}
