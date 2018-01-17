/* @flow */

import Icons from '../design/icons';
import React, { Component } from 'react';
import TextDesign from '../design/text';

import invariant from 'invariant';

import { ActionItemPagerNullState } from '../../content';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Cards as ActionItemCards } from '../action-items';
import { connect } from 'react-redux';
import {
  deleteActionItem,
  focusedActionItemChange,
  selectActionItem,
} from '../actions/actionItems';
import { ActionItemCardSize, ActionItemCardSpacing } from '../design/layout';

import type { ID } from 'common/types/core';
import type { ReduxProps, ReduxState } from '../typesDEPRECATED/redux';

type ComputedProps = {
  +focusedActionItemID: ID | 'EMPTY',
  +actionItemIDs: Array<ID>,
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
  actionItemIDs: Array<ID>,
};

export const DELETE_FADE_TRANSITION_MILLIS = 100;
export const DELETE_SHIFT_TRANSITION_MILLIS = 300;

const SCREEN_WIDTH = Dimensions.get('window').width;

const HalfActionItemCardSpacing = ActionItemCardSpacing / 2;
const SPACE_TO_CENTER =
  (SCREEN_WIDTH - ActionItemCardSize.width - ActionItemCardSpacing) / 2.0;

const PAGER_INSET = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
};

class ActionItemPager extends Component<Props, State> {
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
      actionItemIDs: props.actionItemIDs,
      selectedPage: 0,
    };
  }

  componentWillMount(): void {
    const { focusedActionItemID, actionItemIDs } = this.props;
    const focusedIndex =
      focusedActionItemID === 'EMPTY'
        ? 'EMPTY'
        : actionItemIDs.indexOf(focusedActionItemID);

    invariant(
      focusedIndex === 'EMPTY' || focusedIndex >= 0,
      'Cannot find action item: %s',
      focusedActionItemID,
    );

    const fullWidth = ActionItemCardSize.width + ActionItemCardSpacing;
    const isOnlyActionItem = actionItemIDs.length === 1;
    if (focusedIndex === 'EMPTY' || isOnlyActionItem) {
      this._initialXOffset = 0;
    } else if (focusedIndex === actionItemIDs.length - 1) {
      // Last element in the list is an edge case.
      this._initialXOffset =
        -PAGER_INSET.left +
        actionItemIDs.length * fullWidth -
        SCREEN_WIDTH +
        ActionItemCardSpacing;
    } else if (focusedIndex === 0) {
      this._initialXOffset = -PAGER_INSET.left;
    } else {
      this._initialXOffset =
        -PAGER_INSET.left +
        focusedIndex * fullWidth +
        ActionItemCardSpacing -
        SPACE_TO_CENTER;
    }
  }

  componentDidMount(): void {
    setTimeout(() => {
      this._canHandleScrolling = true;
    }, 400);
  }

  render() {
    return this.state.actionItemIDs.length > 0
      ? this._renderPager()
      : this._renderNullState();
  }

  _renderNullState() {
    return (
      <View style={styles.root}>
        <View style={styles.null}>
          <Image
            resizeMode="contain"
            source={Icons.Null}
            style={styles.nullIcon}
          />
          <Text style={[TextDesign.normalWithEmphasis, styles.nullText]}>
            {ActionItemPagerNullState}
          </Text>
        </View>
      </View>
    );
  }

  _renderPager() {
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
        snapToInterval={ActionItemCardSize.width + ActionItemCardSpacing}
        style={styles.root}
      >
        {this.state.actionItemIDs.map((id, index) => {
          if (
            deleteStage.type === 'SHIFT_PAGES_OVER' &&
            deleteStage.pageIndex === index
          ) {
            return null;
          }
          const ActionItemCard = ActionItemCards[id];
          invariant(ActionItemCard, 'No ActionItem Card for id: %s', id);
          return (
            <Page
              isFirst={index === 0}
              isOnly={this.state.actionItemIDs.length === 1}
              key={id}
              style={this._getPageStyle(id, index)}
            >
              <ActionItemCard
                enableUserInteraction={!isScrolling}
                isFocused={this.props.focusedActionItemID === id}
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
    const { dispatch, actionItemIDs } = this.props;
    const offset = event.nativeEvent.contentOffset.x;
    const index = clamp(
      0,
      actionItemIDs.length - 1,
      Math.round(offset / (ActionItemCardSize.width + ActionItemCardSpacing)),
    );

    const focusedID = actionItemIDs[index];
    if (focusedID !== this.props.focusedActionItemID) {
      dispatch(focusedActionItemChange(focusedID));
    }
  };

  _onScrollStart = (): void => {
    this.setState({ isScrolling: true });
  };

  _onScrollEnd = (): void => {
    this.setState({ isScrolling: false });
  };

  _onNoThanks = (actionItemID: ID, index: number): void => {
    this._genPerformDelete(index);
  };

  _onSeeDetails = (actionItemID: ID, index: number): void => {
    this.props.dispatch(selectActionItem(actionItemID));
  };

  _genPerformDelete = async (index: number): Promise<void> => {
    const { deleteStage, actionItemIDs } = this.state;
    const { dispatch } = this.props;

    const deleteID = actionItemIDs[index];

    invariant(
      deleteStage.type === 'NO_DELETE',
      'Cannot delete more than one action item at a time',
    );
    invariant(deleteID, 'No action item at index %s to delete', index);

    // Perform the transition.
    await this._genSetFadeOutState(index);
    await this._genPerformFadeOut();
    await this._genSetShiftState(index);
    await this._genPerformShift(index);

    const newIndex =
      actionItemIDs.length === 1
        ? null
        : actionItemIDs.length - 1 === index ? index - 1 : index;

    // Delete page and clean up the state.
    const newActionItemIDs = this.state.actionItemIDs.slice();
    newActionItemIDs.splice(index, 1);

    dispatch(deleteActionItem(deleteID));

    const newActionItemID = newIndex ? newActionItemIDs[newIndex] : null;
    if (newActionItemID) {
      dispatch(focusedActionItemChange(newActionItemID));
    }

    this.setState({
      deleteStage: { type: 'NO_DELETE' },
      actionItemIDs: newActionItemIDs,
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
      // NOTE: If we are deleting the last action item in the list, we
      // do not need to perform this animation.
      if (this.state.actionItemIDs.length - 1 === pageIndex) {
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

  _getPageStyle(actionItemID: ID, index: number) {
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
        // NOTE: When deleting a action item such that there is only 1
        // left, we need to transition that last action item so it is
        // centered within the view, instead of being off to the side.

        // NOTE: The first page gets a padding left of non-zero, and every other
        // page has a zero left padding. As a result, when transitioning the
        // second-to-last page to the first slot after deleting the first page,
        // we need to apply that padding left to the second element during
        // the transition.
        const initialPadding =
          this.state.actionItemIDs.length === 2
            ? SPACE_TO_CENTER
            : deleteStage.pageIndex === 0 ? HalfActionItemCardSpacing : 0;
        return deleteStage.pageIndex + 1 === index
          ? {
              paddingLeft: this._deleteShiftTransition.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  initialPadding,
                  ActionItemCardSize.width + HalfActionItemCardSpacing,
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
  const { actionItems } = state;
  const { focusedIndex, ordering } = actionItems;

  return {
    focusedActionItemID:
      focusedIndex === 'EMPTY' ? 'EMPTY' : ordering[focusedIndex],
    actionItemIDs: ordering,
  };
}

export default connect(mapReduxStateToProps)(ActionItemPager);

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
      : props.isFirst ? { marginLeft: ActionItemCardSpacing } : null,
  ];
  return <Animated.View style={style}>{props.children}</Animated.View>;
};

const styles = StyleSheet.create({
  null: {
    alignItems: 'center',
    height: ActionItemCardSize.height,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  nullIcon: {
    height: 75,
    marginBottom: 32,
  },

  nullText: {
    textAlign: 'center',
  },

  page: {
    marginRight: ActionItemCardSpacing,
  },

  root: {
    marginBottom: 4,
  },
});

function clamp(min: number, max: number, val: number): number {
  return Math.min(max, Math.max(min, val));
}
