/* @flow */

import Colors from '../design/colors';
import Icons from '../design/icons';
import React, { Component } from 'react';
import TextDesign from '../design/text';

import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavBarHeight } from '../design/layout';

export type Props = {
  canNavigateBack: bool,
  onPressBack: () => any,
  showHairline: bool,
  title: string,
};

type DefaultProps = {
  showHairline: bool,
};

const BackButtonWidth = 18;
const BackButtonHeight = 15;
const BackButtonShift = 30;
const TransitionMillis = 400;

export default class Header extends Component<Props> {
  static defaultProps: DefaultProps = {
    showHairline: false,
  };

  _transitionValue: Animated.Value;

  constructor(props: Props) {
    super(props);
    this._transitionValue = new Animated.Value(
      props.canNavigateBack ? 1.0 : 0.0,
    );
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.canNavigateBack === this.props.canNavigateBack) {
      return;
    }
    Animated.timing(this._transitionValue, {
      easing: Easing.out(Easing.cubic),
      toValue: nextProps.canNavigateBack ? 1.0 : 0.0,
      duration: TransitionMillis,
    }).start();
  }

  render() {
    const contentStyles = [
      {
        transform: [
          {
            translateX: this._transitionValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -BackButtonShift],
            }),
          },
        ],
      },
      styles.content,
    ];
    const backButtonContainerStyles = [
      { opacity: this._transitionValue },
      styles.backButtonContainer,
    ];
    const titleContainerStyles = [
      styles.titleContainer,
      {
        opacity: this._transitionValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0],
        }),
      },
    ];

    const rootStyles = [
      styles.root,
      this.props.showHairline
        ? { borderBottomWidth: 1, borderColor: Colors.BORDER }
        : null,
    ];

    return (
      <View style={rootStyles}>
        <Animated.View style={contentStyles}>
          <Animated.View style={titleContainerStyles}>
            <Text style={TextDesign.normalWithEmphasis}>
              {this.props.title}
            </Text>
          </Animated.View>
          <Animated.View style={backButtonContainerStyles}>
            <TouchableOpacity
              disabled={!this.props.canNavigateBack}
              onPress={this.props.onPressBack}
            >
              <Image
                resizeMode="contain"
                source={Icons.LeftArrow}
                style={styles.icon}
              />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backButtonContainer: {
    position: 'absolute',
    left: 12 + BackButtonShift,
  },

  content: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  icon: {
    width: BackButtonWidth,
    height: BackButtonHeight,
  },

  root: {
    height: NavBarHeight,
    justifyContent: 'center',
    position: 'relative',
  },

  titleContainer: {
    marginLeft: 12,
  },
});
