/* @flow */

import Colors from '../design/colors';
import React, { Component } from 'react';

import invariant from 'invariant';

import { Animated, Dimensions, Easing } from 'react-native';
import { connect } from 'react-redux';
import {
  ActionItemCardSize,
  ActionItemCardSpacing,
  ActionItemPagerTopOffset,
  NavBarHeight,
} from '../design/layout';

import type { ComponentType } from 'react';
import type { ID } from 'common/types/core';
import type { Inset } from '../reducers/configState';
import type { ReduxProps, ReduxState } from '../typesDEPRECATED/redux';

export type Props = ReduxProps & ComponentProps & ComputedProps;

export type ComputedProps = {
  +pageInset: Inset,
  +actionItemIDs: Array<ID>,
};

export type ComponentProps = {
  +dismissAfterTransitioningOut: bool,
  +actionItemID: ID,
  +show: bool,
  +transitionType: 'HOME_TO_ACTION_ITEM' | 'ACTION_ITEM_TO_HOME',
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
  actionItemFrame: Frame,
  transitionStage: TransitionStage,
};

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const FadeInTransitionMillis = 100;
const TransformTransitionMillis = 250;
const FadeOutTransitionMillis = 100;

export const TransitionInMillis =
  FadeInTransitionMillis + TransformTransitionMillis;
export const TransitionOutMillis = FadeOutTransitionMillis;

class HomeToActionItemTransitionModal extends Component<Props, State> {
  _fadeTransition: Animated.Value;
  _resizeTransition: Animated.Value;
  _subscriptions: Array<{ remove: () => void }> = [];

  state: State;

  constructor(props: Props) {
    super(props);
    this._fadeTransition = new Animated.Value(props.show ? 1.0 : 0.0);
    this._resizeTransition = new Animated.Value(props.show ? 1.0 : 0.0);

    this.state = {
      actionItemFrame: calculateActionItemFrame(props),
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
        if (nextProps.transitionType === 'HOME_TO_ACTION_ITEM') {
          nextProps.dispatch({
            actionItemID: nextProps.actionItemID,
            type: 'SELECT_ACTION_ITEM',
          });
        }
        // Dismiss the modal.
        nextProps.dispatch({
          modalID: 'HOME_TO_ACTION_ITEM_TRANSITION',
          type: 'DISMISS_MODAL',
        });
      });
      this._subscriptions.push(afterTransitioning);

      this._genSetTransitionStage('TRANSITION_IN')
        .then(this._genFadeIn)
        .then(() => {
          if (nextProps.transitionType === 'ACTION_ITEM_TO_HOME') {
            nextProps.dispatch({ type: 'UNSELECT_CURRENT_ACTION_ITEM' });
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
    const { actionItemFrame } = this.state;
    const isHomeToActionItemTransition =
      transitionType === 'HOME_TO_ACTION_ITEM';
    const rootStyles = {
      backgroundColor: this._resizeTransition.interpolate({
        inputRange: [0, 1],
        outputRange: isHomeToActionItemTransition
          ? [Colors.BACKGROUND_LIGHT, Colors.BACKGROUND]
          : [Colors.BACKGROUND, Colors.BACKGROUND_LIGHT],
      }),
      height: this._resizeTransition.interpolate({
        inputRange: [0, 1],
        // NOTE: We are ignoring the bottom inset on purpose. Would like to fill
        // bottom inset as well.
        outputRange: isHomeToActionItemTransition
          ? [actionItemFrame.height, SCREEN_HEIGHT - pageInset.top]
          : [SCREEN_HEIGHT - pageInset.top, actionItemFrame.height],
      }),
      left: this._resizeTransition.interpolate({
        inputRange: [0, 1],
        outputRange: isHomeToActionItemTransition
          ? [pageInset.left + actionItemFrame.left, pageInset.left]
          : [pageInset.left, pageInset.left + actionItemFrame.left],
      }),
      opacity: this._fadeTransition,
      position: 'absolute',
      top: this._resizeTransition.interpolate({
        inputRange: [0, 1],
        outputRange: isHomeToActionItemTransition
          ? [pageInset.top + NavBarHeight + actionItemFrame.top, pageInset.top]
          : [pageInset.top, pageInset.top + NavBarHeight + actionItemFrame.top],
      }),
      width: this._resizeTransition.interpolate({
        inputRange: [0, 1],
        outputRange: isHomeToActionItemTransition
          ? [
              actionItemFrame.width,
              SCREEN_WIDTH - pageInset.left - pageInset.right,
            ]
          : [
              SCREEN_WIDTH - pageInset.left - pageInset.right,
              actionItemFrame.width,
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
          this.props.transitionType === 'HOME_TO_ACTION_ITEM'
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

function calculateActionItemFrame(props: Props): Frame {
  const { actionItemID, actionItemIDs } = props;
  const index = actionItemIDs.indexOf(actionItemID);
  invariant(index >= 0, 'Cannot find actionItem: %s', actionItemID);

  const fullWidth = ActionItemCardSize.width + ActionItemCardSpacing;
  // A action item card can be in one of 3 positions.
  const has1ActionItem = actionItemIDs.length === 1;
  const left =
    index === 0 && !has1ActionItem
      ? ActionItemCardSpacing
      : index === actionItemIDs.length - 1 && !has1ActionItem
        ? SCREEN_WIDTH - fullWidth
        : (SCREEN_WIDTH - fullWidth) / 2.0;

  return {
    height: ActionItemCardSize.height,
    left,
    width: ActionItemCardSize.width,
    top: ActionItemPagerTopOffset,
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
    actionItemIDs: state.actionItems.ordering,
  };
}

export default (connect(mapReduxStateToProps)(
  HomeToActionItemTransitionModal,
): ComponentType<ComponentProps>);
