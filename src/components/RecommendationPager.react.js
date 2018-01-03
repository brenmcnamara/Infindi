/* @flow */

import HomeToRecommendationTransitionModal, {
  TransitionInMillis as ModalTransitionInMillis,
  TransitionOutMillis as ModalTransitionOutMillis,
} from './HomeToRecommendationTransitionModal.react';
import React, { Component } from 'react';

import invariant from 'invariant';

import {
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Cards as RecommendationCards } from '../recommendations';
import { connect } from 'react-redux';
import {
  deleteRecommendation,
  focusedRecommendationChange,
} from '../actions/recommendations';
import {
  RecommendationCardSize,
  RecommendationCardSpacing,
} from '../design/layout';

import type { ID } from 'common/src/types/core';
import type { ReduxProps, ReduxState } from '../typesDEPRECATED/redux';

type ComputedProps = {
  +focusedRecommendationID: ID | 'EMPTY',
  +recommendationIDs: Array<ID>,
};

export type Props = ReduxProps & ComputedProps;

type DeleteTransitionStage =
  | {|
      +type: 'NO_DELETE',
    |}
  | {|
      +pageIndex: number,
      +type: 'FADE_OUT_PAGE',
    |}
  | {|
      +pageIndex: number,
      +type: 'SHIFT_PAGES_OVER',
    |};

type State = {
  deleteStage: DeleteTransitionStage,
  isScrolling: bool,
  recommendationIDs: Array<ID>,
};

export const DELETE_FADE_TRANSITION_MILLIS = 100;
export const DELETE_SHIFT_TRANSITION_MILLIS = 300;

const SCREEN_WIDTH = Dimensions.get('window').width;

const HalfRecommendationCardSpacing = RecommendationCardSpacing / 2;
const SPACE_TO_CENTER =
  (SCREEN_WIDTH - RecommendationCardSize.width - RecommendationCardSpacing) /
  2.0;

const PAGER_INSET = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
};

class RecommendationPager extends Component<Props, State> {
  _canHandleScrolling: bool = false;
  _cards: { [id: ID]: any } = {}; // TODO: Better typing.
  _deleteFadeTransition = new Animated.Value(0);
  _deleteShiftTransition = new Animated.Value(0);
  _initialXOffset: number;

  constructor(props: Props) {
    super(props);

    this.state = {
      deleteStage: { type: 'NO_DELETE' },
      isScrolling: false,
      recommendationIDs: props.recommendationIDs,
      selectedPage: 0,
    };
  }

  componentWillMount(): void {
    const { focusedRecommendationID, recommendationIDs } = this.props;
    const focusedIndex =
      focusedRecommendationID === 'EMPTY'
        ? 'EMPTY'
        : recommendationIDs.indexOf(focusedRecommendationID);

    invariant(
      focusedIndex === 'EMPTY' || focusedIndex >= 0,
      'Cannot find recommendation: %s',
      focusedRecommendationID,
    );

    const fullWidth = RecommendationCardSize.width + RecommendationCardSpacing;
    if (focusedIndex === 'EMPTY') {
      this._initialXOffset = 0;
    } else if (focusedIndex === recommendationIDs.length - 1) {
      // Last element in the list is an edge case.
      this._initialXOffset =
        -PAGER_INSET.left +
        recommendationIDs.length * fullWidth -
        SCREEN_WIDTH +
        RecommendationCardSpacing;
    } else if (focusedIndex === 0) {
      this._initialXOffset = -PAGER_INSET.left;
    } else {
      this._initialXOffset =
        -PAGER_INSET.left +
        focusedIndex * fullWidth +
        RecommendationCardSpacing -
        SPACE_TO_CENTER;
    }
  }

  componentDidMount(): void {
    setTimeout(() => {
      this._canHandleScrolling = true;
    }, 400);
  }

  render() {
    const { deleteStage, isScrolling } = this.state;
    return (
      <ScrollView
        ref={'scrollView'}
        alwaysBounceHorizontal={true}
        alwaysBounceVertical={false}
        automaticallyAdjustContentInsets={false}
        contentInset={PAGER_INSET}
        contentOffset={{ x: this._initialXOffset, y: -PAGER_INSET.top }}
        decelerationRate="fast"
        horizontal={true}
        onMomentumScrollEnd={this._onScrollEnd}
        onScroll={this._onScroll}
        pagingEnabled={false}
        scrollEventThrottle={4}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={
          RecommendationCardSize.width + RecommendationCardSpacing
        }
        style={styles.root}
      >
        {this.state.recommendationIDs.map((id, index) => {
          if (
            deleteStage.type === 'SHIFT_PAGES_OVER' &&
            deleteStage.pageIndex === index
          ) {
            return null;
          }
          const RecommendationCard = RecommendationCards[id];
          invariant(
            RecommendationCard,
            'No Recommendation Card for id: %s',
            id,
          );
          return (
            <Page
              isFirst={index === 0}
              isOnly={this.state.recommendationIDs.length === 1}
              key={id}
              style={this._getPageStyle(id, index)}
            >
              <RecommendationCard
                enableUserInteraction={!isScrolling}
                isFocused={this.props.focusedRecommendationID === id}
                onNoThanks={() => this._onNoThanks(id, index)}
                onSeeDetails={() => this._onSeeDetails(id, index)}
              />
            </Page>
          );
        })}
      </ScrollView>
    );
  }

  _onScroll = (event: Object): void => {
    // NOTE: I hate this can handle scrolling, it is very hacky, but for
    // some annoying reason, react native is calling on scroll when the
    // scroll view has a content offset that it is initialized with. This is
    // resulting in a number of rendering bugs. Need to block the on scroll
    // event until the component has mounted and settled.
    if (!this._canHandleScrolling) {
      return;
    }
    const { dispatch, recommendationIDs } = this.props;
    const offset = event.nativeEvent.contentOffset.x;
    const index = clamp(
      0,
      recommendationIDs.length - 1,
      Math.round(
        offset / (RecommendationCardSize.width + RecommendationCardSpacing),
      ),
    );

    const focusedID = recommendationIDs[index];
    if (focusedID !== this.props.focusedRecommendationID) {
      dispatch(focusedRecommendationChange(focusedID));
    }
  };

  _onScrollStart = (): void => {
    this.setState({ isScrolling: true });
  };

  _onScrollEnd = (): void => {
    this.setState({ isScrolling: false });
  };

  _onNoThanks = (recommendationID: ID, index: number): void => {
    this._genPerformDelete(index);
  };

  _onSeeDetails = (recommendationID: ID, index: number): void => {
    const { dispatch } = this.props;

    // TODO: Guestimate the location of the scroll view element on screen.
    // Make sure it works with different types of phones (includes iphone x)
    dispatch({
      modal: {
        id: 'HOME_TO_RECOMMENDATION_TRANSITION',
        modalType: 'REACT_WITH_TRANSITION',
        priority: 'SYSTEM_CRITICAL',
        renderIn: () => (
          <HomeToRecommendationTransitionModal
            dismissAfterTransitioningOut={true}
            recommendationID={recommendationID}
            show={true}
            transitionType="HOME_TO_RECOMMENDATION"
          />
        ),
        renderInitial: () => (
          <HomeToRecommendationTransitionModal
            dismissAfterTransitioningOut={true}
            recommendationID={recommendationID}
            show={false}
            transitionType="HOME_TO_RECOMMENDATION"
          />
        ),
        renderTransitionOut: () => (
          <HomeToRecommendationTransitionModal
            dismissAfterTransitioningOut={true}
            recommendationID={recommendationID}
            show={false}
            transitionType="HOME_TO_RECOMMENDATION"
          />
        ),
        transitionInMillis: ModalTransitionInMillis,
        transitionOutMillis: ModalTransitionOutMillis,
      },
      type: 'REQUEST_MODAL',
    });
  };

  _genPerformDelete = async (index: number): Promise<void> => {
    const { deleteStage, recommendationIDs } = this.state;
    const { dispatch } = this.props;

    const deleteID = recommendationIDs[index];

    invariant(
      deleteStage.type === 'NO_DELETE',
      'Cannot delete more than one recommendation at a time',
    );
    invariant(deleteID, 'No recommendation at index %s to delete', index);

    // Perform the transition.
    await this._genSetFadeOutState(index);
    await this._genPerformFadeOut();
    await this._genSetShiftState(index);
    await this._genPerformShift(index);

    const newIndex =
      recommendationIDs.length === 1
        ? null
        : recommendationIDs.length - 1 === index ? index - 1 : index;

    // Delete page and clean up the state.
    const newRecommendationIDs = this.state.recommendationIDs.slice();
    newRecommendationIDs.splice(index, 1);

    dispatch(deleteRecommendation(deleteID));

    const newRecommendationID = newIndex
      ? newRecommendationIDs[newIndex]
      : null;
    if (newRecommendationID) {
      dispatch(focusedRecommendationChange(newRecommendationID));
    }

    this.setState({
      deleteStage: { type: 'NO_DELETE' },
      recommendationIDs: newRecommendationIDs,
    });
  };

  // ---------------------------------------------------------------------------
  //
  // ANIMATION UTILITIES
  //
  // ---------------------------------------------------------------------------

  _genSetFadeOutState = (pageIndex: number): Promise<void> => {
    return new Promise(resolve => {
      this._deleteFadeTransition.setValue(1.0);
      this.setState(
        { deleteStage: { pageIndex, type: 'FADE_OUT_PAGE' } },
        resolve,
      );
    });
  };

  _genPerformFadeOut = (): Promise<void> => {
    return new Promise(resolve => {
      // $FlowFixMe - wierd flow error.
      Animated.timing(this._deleteFadeTransition, {
        duration: DELETE_FADE_TRANSITION_MILLIS,
        easing: Easing.out(Easing.cubic),
        toValue: 0.0,
      }).start(resolve);
    });
  };

  _genSetShiftState = (pageIndex: number): Promise<void> => {
    return new Promise(resolve => {
      this._deleteShiftTransition.setValue(1.0);
      this.setState(
        { deleteStage: { pageIndex, type: 'SHIFT_PAGES_OVER' } },
        resolve,
      );
    });
  };

  _genPerformShift = (pageIndex: number): Promise<void> => {
    return new Promise(resolve => {
      // NOTE: If we are deleting the last recommendation in the list, we
      // do not need to perform this animation.
      if (this.state.recommendationIDs.length - 1 === pageIndex) {
        resolve();
        return;
      }
      // $FlowFixMe - Wierd flow error.
      Animated.timing(this._deleteShiftTransition, {
        duration: DELETE_SHIFT_TRANSITION_MILLIS,
        easing: Easing.out(Easing.cubic),
        toValue: 0.0,
      }).start(resolve);
    });
  };

  _getPageStyle(recommendationID: ID, index: number) {
    const { deleteStage } = this.state;
    switch (deleteStage.type) {
      case 'NO_DELETE': {
        return null;
      }

      case 'FADE_OUT_PAGE': {
        return deleteStage.pageIndex === index
          ? { opacity: this._deleteFadeTransition }
          : null;
      }

      case 'SHIFT_PAGES_OVER': {
        // NOTE: When deleting a recommendation such that there is only 1
        // left, we need to transition that last recommendation so it is
        // centered within the view, instead of being off to the side.

        // NOTE: The first page gets a padding left of non-zero, and every other
        // page has a zero left padding. As a result, when transitioning the
        // second-to-last page to the first slot after deleting the first page,
        // we need to apply that padding left to the second element during
        // the transition.
        const initialPadding =
          this.state.recommendationIDs.length === 2
            ? SPACE_TO_CENTER
            : deleteStage.pageIndex === 0 ? HalfRecommendationCardSpacing : 0;
        return deleteStage.pageIndex + 1 === index
          ? {
              paddingLeft: this._deleteShiftTransition.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  initialPadding,
                  RecommendationCardSize.width + HalfRecommendationCardSpacing,
                ],
              }),
            }
          : null;
      }

      default:
        return invariant(false, 'Unhandled delete stage: %s', deleteStage.type);
    }
  }
}

function mapReduxStateToProps(state: ReduxState): ComputedProps {
  const { recommendations } = state;
  const { focusedIndex, ordering } = recommendations;

  return {
    focusedRecommendationID:
      focusedIndex === 'EMPTY' ? 'EMPTY' : ordering[focusedIndex],
    recommendationIDs: ordering,
  };
}

export default connect(mapReduxStateToProps)(RecommendationPager);

type PageProps = {
  children: ?any,
  isFirst: bool,
  isOnly: bool,
  style: any,
};

const Page = (props: PageProps) => {
  const style = [
    styles.page,
    props.style,
    props.isOnly
      ? {
          marginLeft: SPACE_TO_CENTER,
        }
      : props.isFirst ? { marginLeft: RecommendationCardSpacing } : null,
  ];
  return <Animated.View style={style}>{props.children}</Animated.View>;
};

const styles = StyleSheet.create({
  page: {
    marginRight: RecommendationCardSpacing,
  },

  root: {
    marginBottom: 4,
  },
});

function clamp(min: number, max: number, val: number): number {
  return Math.min(max, Math.max(min, val));
}
