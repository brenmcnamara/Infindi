/* @flow */

import Colors from '../design/colors';
import Icons from '../design/icons';
import TextButton from './shared/TextButton.react';
import React, { Component } from 'react';
import TextDesign from '../design/text';

import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';

export const HEIGHT = 270;
export const WIDTH = 335;
export const FOCUS_TRANSITION_TIMEOUT_MILLIS = 500;

export type Props = {
  isFocused: bool,
  onNoThanks: () => any,
  onSeeDetails: () => any,
};

/**
 * The banner for a recommendation with some minimal information about the
 * recommendation.
 */
export default class RecommendationBanner extends Component<Props> {
  _focusTransition: Animated.Value;

  constructor(props: Props) {
    super(props);
    this._focusTransition = new Animated.Value(props.isFocused ? 1.0 : 0.0);
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.isFocused !== this.props.isFocused) {
      Animated.timing(this._focusTransition, {
        duration: FOCUS_TRANSITION_TIMEOUT_MILLIS,
        easing: Easing.out(Easing.cubic),
        toValue: nextProps.isFocused ? 1.0 : 0.0,
      }).start();
    }
  }

  render() {
    const rootStyles = [
      {
        backgroundColor: this._focusTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [
            Colors.BACKGROUND_RECOMMENDATION_BANNER_ACTIVE,
            Colors.BACKGROUND_RECOMMENDATION_BANNER_INACTIVE,
          ],
        }),
      },
      styles.root,
    ];

    return (
      <Animated.View style={rootStyles}>
        <View style={styles.header}>
          <Text style={[TextDesign.normalWithEmphasis]}>
            Open a Health Savings Account
          </Text>
        </View>
        <View style={styles.subHeader}>
          <Text style={[TextDesign.primary]}>
            X months closer to financial freedom
          </Text>
        </View>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Image
              resizeMode="contain"
              source={Icons.PiggyBank}
              style={styles.icon}
            />
          </View>
          <View style={styles.recommendationSubtitleContainer}>
            <Text style={[TextDesign.normal, styles.recommendationSubtitle]}>
              Cut Your Taxes while Saving for your Health
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <TextButton
            isDisabled={!this.props.isFocused}
            onPress={this.props.onNoThanks}
            size="MEDIUM"
            text="No Thanks"
          />
          <View style={styles.buttonSpacer} />
          <TextButton
            isDisabled={!this.props.isFocused}
            onPress={this.props.onSeeDetails}
            size="MEDIUM"
            text="See Details"
            type="PRIMARY"
          />
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  buttonSpacer: {
    flex: 1,
  },

  content: {
    alignItems: 'center',
    flex: 1,
  },

  footer: {
    borderColor: Colors.BORDER,
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 40,
    paddingHorizontal: 4,
  },

  header: {
    marginLeft: 8,
    marginTop: 4,
  },

  icon: {
    height: 85,
  },

  iconContainer: {
    marginTop: 16,
  },

  recommendationSubtitle: {
    textAlign: 'center',
  },

  recommendationSubtitleContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 4,
    marginTop: 16,
  },

  root: {
    borderColor: Colors.BORDER,
    borderWidth: 1,
    height: HEIGHT,
    width: WIDTH,
  },

  subHeader: {
    marginLeft: 8,
    marginTop: 0,
  },
});
