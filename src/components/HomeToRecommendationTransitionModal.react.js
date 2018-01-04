/* @flow */

import Colors from '../design/colors';
import React, { Component } from 'react';

import invariant from 'invariant';

import { Animated, Dimensions, Easing } from 'react-native';
import { connect } from 'react-redux';
import {
  NavBarHeight,
  RecommendationCardSize,
  RecommendationCardSpacing,
  RecommendationPagerTopOffset,
} from '../design/layout';

import type { ComponentType } from 'react';
import type { ID } from 'common/src/types/core';
import type { Inset } from '../reducers/configState';
import type { ReduxProps, ReduxState } from '../typesDEPRECATED/redux';

export type Props = ReduxProps & ComponentProps & ComputedProps;

export type ComputedProps = {
  +pageInset: Inset,
  +recommendationIDs: Array<ID>,
};

export type ComponentProps = {
  +dismissAfterTransitioningOut: bool,
  +recommendationID: ID,
  +show: bool,
  +transitionType: 'HOME_TO_RECOMMENDATION' | 'RECOMMENDATION_TO_HOME',
};

type Frame = {|
  +height: number,
  +left: number,
  +top: number,
  +width: number,
|};

type TransitionStage =
  | 'HIDDEN'
  | 'TRANSITION_IN'
  | 'SHOWING'
  | 'TRANSITION_OUT';

type State = {
  recommendationFrame: Frame,
  transitionStage: TransitionStage,
};

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const FadeInTransitionMillis = 100;
const TransformTransitionMillis = 250;
const FadeOutTransitionMillis = 100;

export const TransitionInMillis =
  FadeInTransitionMillis + TransformTransitionMillis;
export const TransitionOutMillis = FadeOutTransitionMillis;

class HomeToRecommendationTransitionModal extends Component<Props, State> {
  _fadeTransition: Animated.Value;
  _resizeTransition: Animated.Value;
  _subscriptions: Array<{ remove: () => void }> = [];

  state: State;

  constructor(props: Props) {
    super(props);
    this._fadeTransition = new Animated.Value(props.show ? 1.0 : 0.0);
    this._resizeTransition = new Animated.Value(props.show ? 1.0 : 0.0);

    this.state = {
      recommendationFrame: calculateRecommendationFrame(props),
      transitionStage: props.show ? 'HIDDEN' : 'SHOWING',
    };
  }

  // ---------------------------------------------------------------------------
  //
  // LIFECYCLE
  //
  // ---------------------------------------------------------------------------

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.show === this.props.show) {
      return;
    }

    if (nextProps.show) {
      const afterTransitioning = invokable(() => {
        this.setState({ transitionStage: 'SHOWING' });
        // Changing the selection will change the screen underneath this modal.
        if (nextProps.transitionType === 'HOME_TO_RECOMMENDATION') {
          nextProps.dispatch({
            recommendationID: nextProps.recommendationID,
            type: 'SELECT_RECOMMENDATION',
          });
        }
        // Dismiss the modal.
        nextProps.dispatch({
          modalID: 'HOME_TO_RECOMMENDATION_TRANSITION',
          type: 'DISMISS_MODAL',
        });
      });
      this._subscriptions.push(afterTransitioning);

      this._genSetTransitionStage('TRANSITION_IN')
        .then(this._genFadeIn)
        .then(() => {
          if (nextProps.transitionType === 'RECOMMENDATION_TO_HOME') {
            nextProps.dispatch({ type: 'UNSELECT_CURRENT_RECOMMENDATION' });
          }
        })
        .then(this._genResize)
        .then(afterTransitioning.invoke);
    } else {
      const afterTransitioning = invokable(() => {
        this.setState({ transitionStage: 'HIDDEN' }, () => {
          this._resizeTransition = new Animated.Value(0.0);
        });
      });
      this._subscriptions.push(afterTransitioning);
      this._genSetTransitionStage('TRANSITION_OUT')
        .then(this._genFadeOut)
        .then(afterTransitioning.invoke);
    }
  }

  componentWillUnmount(): void {
    this._subscriptions.forEach(s => s.remove());
    this._subscriptions = [];
  }

  // ---------------------------------------------------------------------------
  //
  // RENDER
  //
  // ---------------------------------------------------------------------------

  render() {
    const { pageInset, transitionType } = this.props;
    const { recommendationFrame } = this.state;
    const isHomeToRecommendationTransition =
      transitionType === 'HOME_TO_RECOMMENDATION';
    const rootStyles = {
      backgroundColor: this._resizeTransition.interpolate({
        inputRange: [0, 1],
        outputRange: isHomeToRecommendationTransition
          ? [Colors.BACKGROUND_LIGHT, Colors.BACKGROUND]
          : [Colors.BACKGROUND, Colors.BACKGROUND_LIGHT],
      }),
      height: this._resizeTransition.interpolate({
        inputRange: [0, 1],
        // NOTE: We are ignoring the bottom inset on purpose. Would like to fill
        // bottom inset as well.
        outputRange: isHomeToRecommendationTransition
          ? [recommendationFrame.height, SCREEN_HEIGHT - pageInset.top]
          : [SCREEN_HEIGHT - pageInset.top, recommendationFrame.height],
      }),
      left: this._resizeTransition.interpolate({
        inputRange: [0, 1],
        outputRange: isHomeToRecommendationTransition
          ? [pageInset.left + recommendationFrame.left, pageInset.left]
          : [pageInset.left, pageInset.left + recommendationFrame.left],
      }),
      opacity: this._fadeTransition,
      position: 'absolute',
      top: this._resizeTransition.interpolate({
        inputRange: [0, 1],
        outputRange: isHomeToRecommendationTransition
          ? [
              pageInset.top + NavBarHeight + recommendationFrame.top,
              pageInset.top,
            ]
          : [
              pageInset.top,
              pageInset.top + NavBarHeight + recommendationFrame.top,
            ],
      }),
      width: this._resizeTransition.interpolate({
        inputRange: [0, 1],
        outputRange: isHomeToRecommendationTransition
          ? [
              recommendationFrame.width,
              SCREEN_WIDTH - pageInset.left - pageInset.right,
            ]
          : [
              SCREEN_WIDTH - pageInset.left - pageInset.right,
              recommendationFrame.width,
            ],
      }),
    };
    return <Animated.View style={rootStyles} />;
  }

  // ---------------------------------------------------------------------------
  //
  // TRANSITION UTILITIES
  //
  // ---------------------------------------------------------------------------

  _genFadeIn = (): Promise<void> => {
    return new Promise(resolve => {
      // $FlowFixMe - Why is this wrong?
      Animated.timing(this._fadeTransition, {
        duration: FadeInTransitionMillis,
        easing: Easing.cubic,
        toValue: 1.0,
      }).start(resolve);
    });
  };

  _genResize = (): Promise<void> => {
    return new Promise(resolve => {
      // $FlowFixMe - Why is this wrong?
      Animated.timing(this._resizeTransition, {
        duration: TransformTransitionMillis,
        easing:
          this.props.transitionType === 'HOME_TO_RECOMMENDATION'
            ? Easing.out(Easing.cubic)
            : Easing.out(Easing.quad),
        toValue: 1.0,
      }).start(resolve);
    });
  };

  _genFadeOut = (): Promise<void> => {
    return new Promise(resolve => {
      // $FlowFixMe - Why is this wrong?
      Animated.timing(this._fadeTransition, {
        duration: FadeOutTransitionMillis,
        easing: Easing.out(Easing.cubic),
        toValue: 0.0,
      }).start(resolve);
    });
  };

  _genSetTransitionStage = (
    transitionStage: TransitionStage,
  ): Promise<void> => {
    return new Promise(resolve => {
      this.setState({ transitionStage }, resolve);
    });
  };
}

function invokable(cb: () => any): { remove: () => void, invoke: () => void } {
  let isRemoved = false;
  return {
    remove: () => {
      isRemoved = true;
    },
    invoke: () => {
      !isRemoved && cb();
    },
  };
}

function calculateRecommendationFrame(props: Props): Frame {
  const { recommendationID, recommendationIDs } = props;
  const index = recommendationIDs.indexOf(recommendationID);
  invariant(index >= 0, 'Cannot find recommendation: %s', recommendationID);

  const fullWidth = RecommendationCardSize.width + RecommendationCardSpacing;
  // A recommendation card can be in one of 3 positions.
  const has1Recommendation = recommendationIDs.length === 1;
  const left =
    index === 0 && !has1Recommendation
      ? RecommendationCardSpacing
      : index === recommendationIDs.length - 1 && !has1Recommendation
        ? SCREEN_WIDTH - fullWidth
        : (SCREEN_WIDTH - fullWidth) / 2.0;

  return {
    height: RecommendationCardSize.height,
    left,
    width: RecommendationCardSize.width,
    top: RecommendationPagerTopOffset,
  };
}

function mapReduxStateToProps(state: ReduxState): ComputedProps {
  const { appInset } = state.configState;
  return {
    pageInset: {
      bottom: appInset.bottom,
      left: appInset.left,
      right: appInset.right,
      top: appInset.top,
    },
    recommendationIDs: state.recommendations.ordering,
  };
}

export default (connect(mapReduxStateToProps)(
  HomeToRecommendationTransitionModal,
): ComponentType<ComponentProps>);
