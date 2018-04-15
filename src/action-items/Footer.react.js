/* @flow */

import React, { Component } from 'react';
import TextButton from '../components/shared/TextButton.react';
import Themes from '../design/themes';

import { Animated, Easing, StyleSheet, View } from 'react-native';

export type Props = {
  callToActionText: string,
  onCallToAction: () => any,
  onDismiss: () => any,
  shouldShowCallToAction: boolean,
};

export type DefaultProps = {
  shouldShowCallToAction: boolean,
};

export type TransitionStage =
  | {| +props: Props, +type: 'TRANSITION_OUT' |}
  | {| +props: Props, +type: 'TRANSITION_IN' |}
  | {| +props: Props, +type: 'IN' |};

export type State = {
  transitionStage: TransitionStage,
};

export default class Footer extends Component<Props, State> {
  static defaultProps: DefaultProps = {
    shouldShowCallToAction: true,
  };

  _transitionValue: Animated.Value = new Animated.Value(1.0);

  constructor(props: Props) {
    super(props);
    this.state = {
      transitionStage: { props, type: 'IN' },
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (
      nextProps.shouldShowCallToAction === this.props.shouldShowCallToAction
    ) {
      return;
    }
    this.setState(
      { transitionStage: { type: 'TRANSITION_OUT', props: this.props } },
      () => {
        Animated.timing(this._transitionValue, {
          duration: 200,
          easing: Easing.cubic,
          toValue: 0.0,
        }).start(() => {
          this.setState(
            { transitionStage: { type: 'TRANSITION_IN', props: nextProps } },
            () => {
              Animated.timing(this._transitionValue, {
                duration: 200,
                easing: Easing.out(Easing.cubic),
                toValue: 1.0,
              }).start(() => {
                this.setState({
                  transitionStage: { type: 'IN', props: nextProps },
                });
              });
            },
          );
        });
      },
    );
  }

  render() {
    const props = this.state.transitionStage.props;
    const theme = Themes.primary;
    return (
      <View style={[styles.root, { borderColor: theme.color.borderNormal }]}>
        {props.shouldShowCallToAction
          ? this._renderButtonsWithCallToAction(props)
          : this._renderButtonsWithoutCallToAction(props)}
      </View>
    );
  }

  _renderButtonsWithCallToAction(props: Props) {
    const containerStyles = [
      styles.container,
      { opacity: this._transitionValue },
    ];
    return (
      <Animated.View style={containerStyles}>
        <TextButton
          onPress={props.onDismiss}
          size="LARGE"
          text="NO THANKS"
          type="NORMAL"
        />
        <View style={styles.buttonSpacer} />
        <TextButton
          onPress={props.onCallToAction}
          size="LARGE"
          text={props.callToActionText}
          type="PRIMARY"
        />
      </Animated.View>
    );
  }

  _renderButtonsWithoutCallToAction(props: Props) {
    const containerStyles = [
      styles.container,
      {
        justifyContent: 'center',
        opacity: this._transitionValue,
      },
    ];
    return (
      <Animated.View style={containerStyles}>
        <TextButton
          layoutType="FILL_PARENT"
          onPress={props.onDismiss}
          size="LARGE"
          text="NO THANKS"
          type="NORMAL"
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  buttonSpacer: {
    flex: 1,
  },

  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },

  root: {
    borderTopWidth: 1,
    height: 60,
    paddingHorizontal: 16,
  },
});
