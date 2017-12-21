/* @flow */

import Colors from '../../design/colors';
import React, { Component } from 'react';

import { Animated, Dimensions, StyleSheet, View } from 'react-native';

export type Props = {
  children?: ?any,
  onPressBackground: () => any,
  show: bool,
};

const VERTICAL_OFFSET = 80;

/**
 * A simple abstraction over some of the styling, events and animations for
 * a modal view. This view assumes that it is being rendered inside a component
 * that takes up the entire screen.
 */
export default class ModalTransition extends Component<Props> {
  _transitionProgress = new Animated.Value(0);

  componentDidMount(): void {
    if (this.props.show) {
      Animated.timing(this._transitionProgress, {
        duration: 400,
        toValue: 1,
        useNativeProps: true,
      }).start();
    }
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (this.props.show !== nextProps.show) {
      Animated.timing(this._transitionProgress, {
        duration: 400,
        toValue: nextProps.show ? 1 : 0,
        useNativeProps: true,
      }).start();
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
        <Animated.View
          onPress={this.props.onPressBackground}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'black',
    position: 'absolute',
  },

  modal: {
    backgroundColor: Colors.BACKGROUND,
    zIndex: 1,
  },

  root: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
