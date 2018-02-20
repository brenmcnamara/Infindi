/* @flow */

import Colors from '../../design/colors';
import React, { Component } from 'react';
import TextButton from '../../components/shared/TextButton.react';

import invariant from 'invariant';

import { Animated, Easing, StyleSheet, View } from 'react-native';

type ButtonLayout = ButtonLayout$LeftAndRight | ButtonLayout$Center;

type ButtonLayout$LeftAndRight = {|
  +isLeftButtonDisabled?: bool,
  +isRightButtonDisabled?: bool,
  +leftButtonText: string,
  +rightButtonText: string,
  +type: 'LEFT_AND_RIGHT',
|};

type ButtonLayout$Center = {|
  +centerButtonText: string,
  +isCenterbuttonDisabled?: bool,
  +type: 'CENTER',
|};

export type Props = {
  buttonLayout: ButtonLayout,
  onPress: (button: 'LEFT' | 'RIGHT' | 'CENTER') => any,
};

export type DefaultProps = {
  shouldShowCallToAction: bool,
};

export type TransitionStage =
  | {| +props: Props, +type: 'TRANSITION_OUT' |}
  | {| +props: Props, +type: 'TRANSITION_IN' |}
  | {| +props: Props, +type: 'IN' |};

export type State = {
  transitionStage: TransitionStage,
};

export default class Footer extends Component<Props, State> {
  _transitionValue: Animated.Value = new Animated.Value(1.0);

  constructor(props: Props) {
    super(props);
    this.state = {
      transitionStage: { props, type: 'IN' },
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (
      !this._shouldAnimateButtonLayoutChange(
        nextProps.buttonLayout,
        this.props.buttonLayout,
      )
    ) {
      this.setState({ transitionStage: { type: 'IN', props: nextProps } });
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
    return (
      <View style={styles.root}>
        {props.buttonLayout.type === 'LEFT_AND_RIGHT'
          ? this._renderLeftAndRightButtons(props)
          : this._renderCenterButton(props)}
      </View>
    );
  }

  _renderLeftAndRightButtons(props: Props) {
    const { buttonLayout } = props;
    invariant(
      buttonLayout.type === 'LEFT_AND_RIGHT',
      'Incorrect button layout type',
    );

    const containerStyles = [
      styles.container,
      { opacity: this._transitionValue },
    ];
    return (
      <Animated.View style={containerStyles}>
        <TextButton
          isDisabled={buttonLayout.isLeftButtonDisabled || false}
          onPress={() => props.onPress('LEFT')}
          size="LARGE"
          text={buttonLayout.leftButtonText}
          type="NORMAL"
        />
        <View style={styles.buttonSpacer} />
        <TextButton
          isDisabled={buttonLayout.isRightButtonDisabled || false}
          onPress={() => props.onPress('RIGHT')}
          size="LARGE"
          text={buttonLayout.rightButtonText}
          type="PRIMARY"
        />
      </Animated.View>
    );
  }

  _renderCenterButton(props: Props) {
    const { buttonLayout } = props;
    invariant(buttonLayout.type === 'CENTER', 'Incorrect button layout type');
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
          isDisabled={buttonLayout.isCenterbuttonDisabled || false}
          layoutType="FILL_PARENT"
          onPress={() => props.onPress('CENTER')}
          size="LARGE"
          text={buttonLayout.centerButtonText}
          type="NORMAL"
        />
      </Animated.View>
    );
  }

  _shouldAnimateButtonLayoutChange(
    layout1: ButtonLayout,
    layout2: ButtonLayout,
  ): bool {
    if (layout1.type !== layout2.type) {
      return true;
    }

    if (layout1.type === 'CENTER') {
      // $FlowFixMe - Already verified type.
      return layout1.centerButtonText !== layout2.centerButtonText;
    }
    return (
      // $FlowFixMe - Already verified type.
      layout1.leftButtonText !== layout2.leftButtonText ||
      // $FlowFixMe - Already verified type.
      layout1.rightButtonText !== layout2.rightButtonText
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
    borderColor: Colors.BORDER_HAIRLINE,
    borderTopWidth: 1,
    height: 50,
    paddingHorizontal: 16,
  },
});