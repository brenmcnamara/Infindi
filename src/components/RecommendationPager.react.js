/* @flow */

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
  RecommendationCardSize,
  RecommendationCardSpacing,
} from '../design/layout';

import type { ID } from 'common/src/types/core';
import type { ReduxProps, ReduxState } from '../typesDEPRECATED/redux';

export type Props = ReduxProps & {
  recommendationIDs: Array<ID>,
};

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
  recommendationIDs: Array<ID>,
  selectedPage: ?number,
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
  _deleteFadeTransition = new Animated.Value(0);
  _deleteShiftTransition = new Animated.Value(0);

  constructor(props: Props) {
    super(props);

    this.state = {
      deleteStage: { type: 'NO_DELETE' },
      recommendationIDs: props.recommendationIDs,
      selectedPage: 0,
    };
  }

  render() {
    const { deleteStage } = this.state;
    return (
      <ScrollView
        ref={'scrollView'}
        alwaysBounceHorizontal={true}
        alwaysBounceVertical={false}
        automaticallyAdjustContentInsets={false}
        contentInset={PAGER_INSET}
        contentOffset={{ x: -PAGER_INSET.left, y: -PAGER_INSET.top }}
        decelerationRate="fast"
        horizontal={true}
        onScroll={this._onScrollRecommendationPager}
        pagingEnabled={false}
        scrollEventThrottle={11}
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
                isFocused={this.state.selectedPage === index}
                onNoThanks={() => this._onNoThanks(id, index)}
                onSeeDetails={() => this._onSeeDetails(id, index)}
              />
            </Page>
          );
        })}
      </ScrollView>
    );
  }

  _onScrollRecommendationPager = (event: Object): void => {
    const offset = event.nativeEvent.contentOffset.x;
    const page = clamp(
      0,
      3,
      Math.round(
        offset / (RecommendationCardSize.width + RecommendationCardSpacing),
      ),
    );
    if (page !== this.state.page) {
      this.setState({ selectedPage: page });
    }
  };

  _onNoThanks = (recommendationID: ID, index: number): void => {
    this._genPerformDelete(index);
  };

  _onSeeDetails = (recommendationID: ID, index: number): void => {};

  _genPerformDelete = async (index: number): Promise<void> => {
    const { deleteStage, recommendationIDs } = this.state;
    invariant(
      deleteStage.type === 'NO_DELETE',
      'Cannot delete more than one recommendation at a time',
    );
    invariant(
      recommendationIDs[index],
      'No recommendation at index %s to delete',
      index,
    );

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

    this.setState({
      deleteStage: { type: 'NO_DELETE' },
      recommendationIDs: newRecommendationIDs,
      selectedPage: newIndex,
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

function mapReduxStateToProps(state: ReduxState) {
  return {
    recommendationIDs: ['OPEN_HSA_ACCOUNT', 'OPEN_ROTH_ACCOUNT'],
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
