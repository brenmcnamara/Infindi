/* @flow */

import Colors from '../design/colors';
import TextButton from '../components/shared/TextButton.react';
import React, { Component } from 'react';
import TextDesign from '../design/text';

import { ActionItemCardSize } from '../design/layout';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';

import type { ActionItemCardProps, ActionItemTemplate } from '.';

export const FOCUS_TRANSITION_TIMEOUT_MILLIS = 500;

export type Props = ActionItemCardProps & {
  +icon: number,
  +template: ActionItemTemplate,
};

export default function createCard(template: ActionItemTemplate, icon: number) {
  return (props: ActionItemCardProps) => (
    <Card {...props} icon={icon} template={template} />
  );
}

/**
 * The banner for a actino item with some minimal information about the
 * actino item.
 */
class Card extends Component<Props> {
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
    const {
      enableUserInteraction,
      icon,
      isFocused,
      onNoThanks,
      onSeeDetails,
      template,
    } = this.props;
    const rootStyles = [
      {
        backgroundColor: this._focusTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [
            Colors.BACKGROUND_ACTION_ITEM_BANNER_ACTIVE,
            Colors.BACKGROUND_ACTION_ITEM_BANNER_INACTIVE,
          ],
        }),
      },
      styles.root,
    ];

    return (
      <Animated.View style={rootStyles}>
        <View style={styles.header}>
          <Text style={[TextDesign.normalWithEmphasis]}>{template.title}</Text>
        </View>
        <View style={styles.subHeader}>
          <Text style={[TextDesign.primary]}>{template.savingsStatement}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Image resizeMode="contain" source={icon} style={styles.icon} />
          </View>
          <View style={styles.actionItemSubtitleContainer}>
            <Text style={[TextDesign.normal, styles.actionItemSubtitle]}>
              {template.subTitle}
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <TextButton
            isDisabled={!isFocused || !enableUserInteraction}
            onPress={onNoThanks}
            size="MEDIUM"
            text="No Thanks"
          />
          <View style={styles.buttonSpacer} />
          <TextButton
            isDisabled={!isFocused || !enableUserInteraction}
            onPress={onSeeDetails}
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
  actionItemSubtitle: {
    textAlign: 'center',
  },

  actionItemSubtitleContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 4,
  },

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
    paddingHorizontal: 8,
  },

  header: {
    marginLeft: 8,
    marginTop: 4,
  },

  icon: {
    height: 85,
  },

  iconContainer: {
    justifyContent: 'center',
    marginTop: 16,
  },

  root: {
    borderColor: Colors.BORDER,
    borderWidth: 1,
    height: ActionItemCardSize.height,
    width: ActionItemCardSize.width,
  },

  subHeader: {
    marginLeft: 8,
    marginTop: 0,
  },
});
