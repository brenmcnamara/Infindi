/* @flow */

import RecommendationBanner, {
  WIDTH as RECOMMENDATION_BANNER_WIDTH,
} from './RecommendationBanner.react';
import React, { Component } from 'react';

import invariant from 'invariant';

import {
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { connect } from 'react-redux';

import type { ReduxProps, ReduxState } from '../typesDEPRECATED/redux';

type Recommendation = string; // TODO: THIS IS A TEMPORARY TYPE

export type Props = ReduxProps & {
  recommendations: Array<Recommendation>,
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
  recommendations: Array<Recommendation>,
  selectedPage: ?number,
};

export const DELETE_FADE_TRANSITION_MILLIS = 100;
export const DELETE_SHIFT_TRANSITION_MILLIS = 300;

const SCREEN_WIDTH = Dimensions.get('window').width;
const SPACE_BETWEEN_PAGES = 4;
const HALF_SPACE_BETWEEN_PAGES = SPACE_BETWEEN_PAGES / 2;
const SPACE_TO_CENTER =
  (SCREEN_WIDTH - RECOMMENDATION_BANNER_WIDTH - SPACE_BETWEEN_PAGES) / 2.0;

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
      recommendations: props.recommendations,
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
        snapToInterval={RECOMMENDATION_BANNER_WIDTH + SPACE_BETWEEN_PAGES}
        style={styles.root}
      >
        {this.state.recommendations.map((r, i) => {
          if (
            deleteStage.type === 'SHIFT_PAGES_OVER' &&
            deleteStage.pageIndex === i
          ) {
            return null;
          }
          return (
            <Page
              isFirst={i === 0}
              isOnly={this.state.recommendations.length === 1}
              key={r}
              style={this._getPageStyle(r, i)}
            >
              <RecommendationBanner
                isFocused={this.state.selectedPage === i}
                onNoThanks={() => this._onNoThanks(r, i)}
                onSeeDetails={() => this._onSeeDetails(r, i)}
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
      Math.round(offset / (RECOMMENDATION_BANNER_WIDTH + SPACE_BETWEEN_PAGES)),
    );
    if (page !== this.state.page) {
      this.setState({ selectedPage: page });
    }
  };

  _onNoThanks = (recommendation: Recommendation, index: number): void => {
    this._genPerformDelete(index);
  };

  _onSeeDetails = (recommendation: Recommendation, index: number): void => {};

  _genPerformDelete = async (index: number): Promise<void> => {
    const { deleteStage, recommendations } = this.state;
    invariant(
      deleteStage.type === 'NO_DELETE',
      'Cannot delete more than one recommendation at a time',
    );
    invariant(
      recommendations[index],
      'No recommendation at index %s to delete',
      index,
    );

    // Perform the transition.
    await this._genSetFadeOutState(index);
    await this._genPerformFadeOut();
    await this._genSetShiftState(index);
    await this._genPerformShift(index);

    const newIndex =
      recommendations.length === 1
        ? null
        : recommendations.length - 1 === index ? index - 1 : index;

    // Delete page and clean up the state.
    const newRecommendations = this.state.recommendations.slice();
    newRecommendations.splice(index, 1);

    this.setState({
      deleteStage: { type: 'NO_DELETE' },
      recommendations: newRecommendations,
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
      if (this.state.recommendations.length - 1 === pageIndex) {
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

  _getPageStyle(recommendation: Recommendation, index: number) {
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
          this.state.recommendations.length === 2
            ? SPACE_TO_CENTER
            : deleteStage.pageIndex === 0 ? SPACE_BETWEEN_PAGES : 0;
        return deleteStage.pageIndex + 1 === index
          ? {
              paddingLeft: this._deleteShiftTransition.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  initialPadding,
                  RECOMMENDATION_BANNER_WIDTH + HALF_SPACE_BETWEEN_PAGES,
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
    recommendations: ['a', 'b', 'c', 'd'],
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
      : props.isFirst ? { marginLeft: SPACE_BETWEEN_PAGES } : null,
  ];
  return <Animated.View style={style}>{props.children}</Animated.View>;
};

const styles = StyleSheet.create({
  page: {
    marginRight: SPACE_BETWEEN_PAGES,
  },

  root: {
    marginBottom: 4,
  },
});

function clamp(min: number, max: number, val: number): number {
  return Math.min(max, Math.max(min, val));
}
