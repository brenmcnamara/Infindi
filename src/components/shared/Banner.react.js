/* @flow */

import Colors from '../../design/colors';
import React, { Component } from 'react';
import TextDesign from '../../design/text';

import invariant from 'invariant';
import nullthrows from 'nullthrows';

import { Animated, Easing, StyleSheet } from 'react-native';

import type { ID } from 'common/types/core';
import type { Toast$Banner } from '../../reducers/toast';

export type Props = {
  banner: Toast$Banner | null,
};

type TransitionState =
  | {| +type: 'EMPTY' |}
  | {|
      +banner: Toast$Banner,
      +type: 'IN',
    |}
  | {|
      +banner: Toast$Banner,
      +type: 'TRANSITION_IN',
    |}
  | {|
      +banner: Toast$Banner,
      +type: 'TRANSITION_OUT',
    |};

type State = {
  transition: TransitionState,
};

export const TRANSITION_OUT_MILLIS = 400;
export const TRANSITION_IN_MILLIS = 300;

const BANNER_TEXT_PADDING = 2;
const BANNER_HEIGHT = 22 + 2 * BANNER_TEXT_PADDING; // TEXT LINE HEIGHT + PADDING

export default class Banner extends Component<Props, State> {
  _currentTransitionID: ID = 'request-0';
  _height: Animated.Value;
  _isMounted: bool = false; // TODO: Should remove this.
  _transitionIDNumber: number = 1;

  constructor(props: Props) {
    super(props);
    this._height = new Animated.Value(props.banner ? BANNER_HEIGHT : 0);
    this.state = {
      transition: props.banner
        ? { banner: props.banner, type: 'IN' }
        : { type: 'EMPTY' },
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    const transitionID = `request-${this._transitionIDNumber}`;
    ++this._transitionIDNumber;
    this._currentTransitionID = transitionID;

    const prevBanner = this.props.banner;
    const nextBanner = nextProps.banner;
    const prevID = prevBanner ? prevBanner.id : null;
    const newID = nextBanner ? nextBanner.id : null;
    if (prevID === newID) {
      const currentTransition = this.state.transition;
      let newTransition;
      switch (currentTransition.type) {
        case 'TRANSITION_IN':
          newTransition = {
            banner: nullthrows(nextProps.banner),
            type: 'TRANSITION_IN',
          };
          break;

        case 'TRANSITION_OUT':
          newTransition = {
            banner: nullthrows(nextProps.banner),
            type: 'TRANSITION_OUT',
          };
          break;

        case 'IN':
          newTransition = {
            banner: nullthrows(nextProps.banner),
            type: 'IN',
          };
          break;

        case 'OUT':
          newTransition = {
            banner: nullthrows(nextProps.banner),
            type: 'OUT',
          };
          break;

        case 'EMPTY':
          newTransition = { type: 'EMPTY' };
          break;

        default:
          invariant(
            false,
            'Unknown transition type %s',
            currentTransition.type,
          );
      }
      // $FlowFixMe - This is correct.
      this.setState({ transition: newTransition });
      return;
    }

    invariant(
      prevBanner || nextBanner,
      'Expecting either previous banner or next banner to exist',
    );

    // TODO: This logic will go haywire when trying to present multiple
    // transitions simultaneously.

    // eslint-disable-next-line no-unused-vars
    let transitionChain = Promise.resolve();

    if (prevBanner) {
      transitionChain = transitionChain.then(
        () => this._isMounted && this._genPerformTransitionOut(prevBanner),
      );
    }

    if (nextBanner) {
      transitionChain = transitionChain.then(
        () => this._isMounted && this._genPerformTransitionIn(nextBanner),
      );
    }

    if (!nextBanner) {
      transitionChain = transitionChain.then(
        () =>
          this._isMounted &&
          this._currentTrasitionID === transitionID &&
          this.setState({ transition: { type: 'EMPTY' } }),
      );
    }
  }

  componentDidMount(): void {
    this._isMounted = true;
  }

  componentWillUnmount(): void {
    this._isMounted = false;
  }

  render() {
    const banner = this._getBanner();
    if (!banner) {
      return null;
    }
    const rootStyles = {
      backgroundColor: Colors.BANNER_BACKGROUND[banner.bannerType],
      height: this._height,
    };
    const textStyles = [
      styles.root,
      TextDesign.smallWithEmphasis,
      {
        color: Colors.BANNER_TEXT[banner.bannerType],
        height: this._height,
      },
    ];

    return (
      <Animated.View style={rootStyles}>
        <Animated.Text style={textStyles}>{banner.text}</Animated.Text>
      </Animated.View>
    );
  }

  _genPerformTransitionOut(banner: Toast$Banner): Promise<void> {
    return new Promise(resolve => {
      this.setState({ transition: { banner, type: 'TRANSITION_OUT' } }, () => {
        if (!this._isMounted) {
          return;
        }
        // $FlowFixMe - Need to figure out why this is an error.
        Animated.timing(this._height, {
          easing: Easing.out(Easing.cubic),
          duration: TRANSITION_OUT_MILLIS,
          toValue: 0,
        }).start(resolve);
      });
    });
  }

  _genPerformTransitionIn(banner: Toast$Banner): Promise<void> {
    return new Promise(resolve => {
      if (!this._isMounted) {
        return;
      }
      this.setState({ transition: { banner, type: 'TRANSITION_IN' } }, () => {
        // $FlowFixMe - Need to figure out why this is an error.
        Animated.timing(this._height, {
          easing: Easing.out(Easing.cubic),
          duration: TRANSITION_IN_MILLIS,
          toValue: BANNER_HEIGHT,
        }).start(resolve);
      });
    });
  }

  _getBanner(): ?Toast$Banner {
    const { transition } = this.state;
    switch (transition.type) {
      case 'EMPTY':
        return null;
      case 'IN':
      case 'TRANSITION_IN':
      case 'TRANSITION_OUT':
        return transition.banner;
    }
  }
}

const styles = StyleSheet.create({
  root: {
    marginTop: BANNER_TEXT_PADDING,
    textAlign: 'center',
  },
});
