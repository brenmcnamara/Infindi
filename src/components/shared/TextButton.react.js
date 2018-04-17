/* @flow */

import React, { Component } from 'react';

import { GetTheme } from '../../design/components/Theme.react';
import { Text, TouchableOpacity } from 'react-native';

import type { Theme } from '../../design/themes';

export type ButtonType = 'PRIMARY' | 'NORMAL' | 'SPECIAL';
export type ButtonSize = 'SMALL' | 'MEDIUM' | 'LARGE';
export type LayoutType =
  | 'FILL_PARENT'
  | 'INLINE'
  | 'INLINE_BLOCK'
  | 'INLINE_BLOCK_CENTERED';

export type Props = {
  // TODO: Change this to "isEnabled"
  isDisabled: boolean,
  layoutType: LayoutType,
  onPress: () => any,
  size: 'LARGE' | 'MEDIUM' | 'SMALL',
  text: string,
  type: 'PRIMARY' | 'NORMAL' | 'SPECIAL',
};

export type DefaultProps = {
  isDisabled: boolean,
  layoutType: LayoutType,
  size: ButtonSize,
  type: ButtonType,
};

export default class TextButton extends Component<Props> {
  static defaultProps: DefaultProps = {
    isDisabled: false,
    layoutType: 'INLINE_BLOCK_CENTERED',
    size: 'MEDIUM',
    type: 'NORMAL',
  };

  render() {
    const { layoutType, text } = this.props;
    const rootStyles =
      layoutType === 'FILL_PARENT'
        ? {
            alignSelf: 'stretch',
            flex: 1,
            justifyContent: 'center',
          }
        : {
            alignSelf: 'center',
          };

    // TODO: Inline text button is not really usable without the touchable
    // opacity. Need to figure out how to add a touchable opacity without a
    // view. Need to register on press down and press up events of text
    // element, which the current api does not allow us to do.
    return (
      <GetTheme>
        {theme =>
          layoutType === 'INLINE' ? (
            <Text onPress={this._onPress} style={this._getButtonStyles(theme)}>
              {text}
            </Text>
          ) : (
            <TouchableOpacity
              disabled={this.props.isDisabled}
              onPress={this._onPress}
              style={rootStyles}
            >
              <Text style={this._getButtonStyles(theme)}>{text}</Text>
            </TouchableOpacity>
          )
        }
      </GetTheme>
    );
  }

  _onPress = (): void => {
    if (!this.props.isDisabled) {
      this.props.onPress();
    }
  };

  _getButtonStyles(theme: Theme) {
    const { isDisabled, layoutType, size, type } = this.props;

    return [
      layoutType === 'INLINE_BLOCK_CENTERED' || layoutType === 'FILL_PARENT'
        ? { textAlign: 'center' }
        : null,
      {
        color:
          type === 'PRIMARY'
            ? isDisabled
              ? theme.color.textPrimaryDisabled
              : theme.color.textPrimary
            : type === 'SPECIAL'
              ? theme.color.textSpecial
              : isDisabled
                ? theme.color.textDisabled
                : theme.color.textNormal,
        fontFamily: isDisabled ? theme.fontFamily.thin : theme.fontFamily.thick,
        fontSize:
          size === 'LARGE'
            ? theme.fontSize.header3
            : size === 'SMALL'
              ? theme.fontSize.small
              : theme.fontSize.normal,
      },
    ];
  }
}
