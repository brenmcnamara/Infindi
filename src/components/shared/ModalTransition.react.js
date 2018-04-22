/* @flow */

import React, { Component } from 'react';

import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export type Props = {
  animateOnMount: boolean,
  children?: ?any,
  onPressBackground: () => any,
  show: boolean,
};

export const TransitionInMillis = 300;
export const TransitionOutMillis = 300;

const VERTICAL_OFFSET = 30;

/**
 * A simple abstraction over some of the styling, events and animations for
 * a modal view. This view assumes that it is being rendered inside a component
 * that takes up the entire screen.
 */
export default class ModalTransition extends Component<Props> {
  _isTransitioning: boolean = false;
  _transitionProgress = new Animated.Value(0);

  componentWillMount(): void {
    if (this.props.show && !this.props.animateOnMount) {
      this._transitionProgress.setValue(1);
    }
  }

  componentDidMount(): void {
    if (this.props.show && this.props.animateOnMount) {
      this._isTransitioning = true;
      Animated.timing(this._transitionProgress, {
        duration: TransitionInMillis,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: true,
      }).start(() => {
        this._isTransitioning = false;
      });
    }
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (this.props.show !== nextProps.show) {
      this._isTransitioning = true;
      Animated.timing(this._transitionProgress, {
        duration: nextProps.show ? TransitionInMillis : TransitionOutMillis,
        easing: Easing.out(Easing.cubic),
        toValue: nextProps.show ? 1 : 0,
        useNativeDriver: true,
      }).start(() => {
        this._isTransitioning = false;
      });
    }
  }

  render() {
    const { height, width } = Dimensions.get('window');
    return (
      <View style={styles.root}>
        <Animated.View
          style={[
            styles.modal,
            {
              opacity: this._transitionProgress,
              transform: [
                {
                  translateY: this._transitionProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [VERTICAL_OFFSET, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {this.props.children}
        </Animated.View>
        {/*
          * TODO: Subtle UI improvement: Would like if someone presses then
          * drags there finger onto the modal to not call this press event.
          */}
        <TouchableWithoutFeedback onPress={this._onPressBackground}>
          <Animated.View
            style={[
              styles.background,
              {
                height,
                opacity: this._transitionProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.4],
                }),
                width,
              },
            ]}
          />
        </TouchableWithoutFeedback>
      </View>
    );
  }

  _onPressBackground = (): void => {
    !this._isTransitioning && this.props.onPressBackground();
  };
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'black',
    position: 'absolute',
  },

  modal: {
    zIndex: 1,
  },

  root: {
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'center',
  },
});
