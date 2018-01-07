/* @flow */

import React, { Component } from 'react';
import TextDesign from '../../design/text';

import { Text, TouchableOpacity } from 'react-native';

export type ButtonType = 'PRIMARY' | 'NORMAL' | 'SPECIAL';
export type ButtonSize = 'SMALL' | 'MEDIUM' | 'LARGE';
export type LayoutType =
  | 'FILL_PARENT'
  | 'INLINE'
  | 'INLINE_BLOCK'
  | 'INLINE_BLOCK_CENTERED';

export type Props = {
  // TODO: Change this to "isEnabled"
  isDisabled: bool,
  layoutType: LayoutType,
  onPress: () => any,
  size: 'LARGE' | 'MEDIUM' | 'SMALL',
  text: string,
  type: 'PRIMARY' | 'NORMAL' | 'SPECIAL',
};

export type DefaultProps = {
  isDisabled: bool,
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
    const { layoutType, size, text, type } = this.props;
    const buttonStyles = [
      layoutType === 'INLINE_BLOCK_CENTERED' || layoutType === 'FILL_PARENT'
        ? { textAlign: 'center' }
        : null,
      {
        fontSize:
          size === 'LARGE'
            ? TextDesign.largeFontSize
            : size === 'SMALL'
              ? TextDesign.smallFontSize
              : TextDesign.mediumFontSize,
      },
      type === 'PRIMARY'
        ? TextDesign.primaryButton
        : type === 'SPECIAL'
          ? TextDesign.specialButton
          : TextDesign.normalButton,
    ];
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
    return layoutType === 'INLINE' ? (
      <Text onPress={this._onPress} style={buttonStyles}>
        {text}
      </Text>
    ) : (
      <TouchableOpacity
        disabled={this.props.isDisabled}
        onPress={this._onPress}
        style={rootStyles}
      >
        <Text style={buttonStyles}>{text}</Text>
      </TouchableOpacity>
    );
  }

  _onPress = (): void => {
    if (!this.props.isDisabled) {
      this.props.onPress();
    }
  };
}
