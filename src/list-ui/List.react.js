/* @flow */

import ListItem from './ListItem.react';
import React, { Component } from 'react';

import invariant from 'invariant';

import { Animated, Easing, FlatList } from 'react-native';

import type { ComponentType } from 'react';

export type Inset = {
  bottom: number,
  left: number,
  right: number,
  top: number,
};

export type ListItemData = {
  Comp: ComponentType<*>,
  height: number,
  key: string,
};

export type Props = {
  contentInset: Inset,
  initialNumToRender: number,
  data: Array<ListItemData>,
  keyboardShouldPersistTaps?: 'always',
};

export type ListItemChange =
  | {|
      +type: 'INITIALIZE',
    |}
  | {|
      +type: 'ADD',
    |}
  | {|
      +type: 'REMOVE',
    |}
  | {|
      type: 'NONE',
    |};

const ITEM_CHANGE_INITIALIZE = { type: 'INITIALIZE' };
const ITEM_CHANGE_ADD = { type: 'ADD' };
const ITEM_CHANGE_REMOVE = { type: 'REMOVE' };
const ITEM_CHANGE_NONE = { type: 'NONE' };

const TRANSITION_INITIALIZE_DURATION_PER_ITEM_MS = 200;
const TRANSITION_INITIALIZE_DELAY_PER_ITEM_MS = 30;
const TRANSITION_INITIALIZE_EASING = Easing.out(Easing.poly(5));

type State = {
  initializeCount: number,
  itemOrdering: Array<string>,
  itemMap: { [key: string]: ListItemData },
  itemChangeMap: { [key: string]: ListItemChange },
  isListInitializing: boolean,
};

export default class List extends Component<Props, State> {
  _initializeTransition: Animated.Value = new Animated.Value(0);

  constructor(props: Props) {
    super(props);
    this.state = this._calculateState(props, /* isInitializing */ true);
  }

  componentDidMount(): void {
    Animated.timing(this._initializeTransition, {
      duration:
        TRANSITION_INITIALIZE_DELAY_PER_ITEM_MS * this.state.initializeCount,
      easing: TRANSITION_INITIALIZE_EASING,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }

  componentWillReceiveProps(nextProps: Props): void {
    const prevData = this.props.data;
    const nextData = nextProps.data;

    if (prevData === nextData) {
      return;
    }

    this.setState(this._calculateState(nextProps));
  }

  render() {
    return (
      <FlatList
        automaticallyAdjustContentInsets={false}
        contentInset={this.props.contentInset}
        data={this.state.itemOrdering}
        initialNumToRender={this.props.initialNumToRender}
        keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps}
        keyExtractor={this._keyExtractor}
        removeClippedSubviews={false}
        renderItem={this._renderRowItem}
      />
    );
  }

  _renderRowItem = ({ index, item: itemKey }) => {
    const item = this.state.itemMap[itemKey];
    const change = this.state.itemChangeMap[itemKey];
    const totalDuration =
      (this.state.initializeCount - 1) *
        TRANSITION_INITIALIZE_DELAY_PER_ITEM_MS +
      TRANSITION_INITIALIZE_DURATION_PER_ITEM_MS;
    const initializeStart =
      index * TRANSITION_INITIALIZE_DELAY_PER_ITEM_MS / totalDuration;

    const { Comp, height } = item;
    return (
      <ListItem
        height={height}
        index={index}
        initializeStart={initializeStart}
        initializeTransition={this._initializeTransition}
        isListInitializing={this.state.isListInitializing}
        onAddTransitionComplete={() => this._onAddTransitionComplete(itemKey)}
        onRemoveTransitionComplete={() =>
          this._onRemoveTransitionComplete(itemKey)
        }
      >
        {change.type === 'REMOVE' ? null : <Comp />}
      </ListItem>
    );
  };

  _calculateState(
    props: Props,
    isInitializing: boolean = false,
  ): $Shape<State> {
    const { data } = props;
    const itemOrdering = data.map(item => item.key);
    const itemMap = {};
    const itemChangeMap = {};
    data.forEach(item => {
      let change;
      if (isInitializing) {
        change = ITEM_CHANGE_INITIALIZE;
      } else if (!this.state.itemMap[item.key]) {
        change = ITEM_CHANGE_ADD;
      } else {
        change = ITEM_CHANGE_NONE;
      }
      itemMap[item.key] = item;
      itemChangeMap[item.key] = change;
    });

    if (isInitializing) {
      return {
        initializeCount: itemOrdering.length,
        isListInitializing: true,
        itemChangeMap,
        itemMap,
        itemOrdering,
      };
    }

    // Check for any items that were removed. This should only happen if we
    // are not initializing.
    this.state.itemOrdering.forEach((itemKey, index) => {
      if (!itemMap[itemKey]) {
        itemOrdering.splice(index, 0, itemKey);
        itemChangeMap[itemKey] = ITEM_CHANGE_REMOVE;
        itemMap[itemKey] = this.state.itemMap[itemKey];
      }
    });

    return {
      isListInitializing: false,
      itemChangeMap,
      itemMap,
      itemOrdering,
    };
  }

  _keyExtractor = (key: string) => key;

  _onAddTransitionComplete = (itemKey: string): void => {};

  _onRemoveTransitionComplete = (itemKey: string): void => {
    const itemOrdering = this.state.itemOrdering.slice();
    const index = itemOrdering.indexOf(itemKey);
    invariant(
      index >= 0,
      'Trying to remove item that deos not exist: %s',
      itemKey,
    );
    itemOrdering.splice(index, 1);

    const itemChangeMap = { ...this.state.itemChangeMap };
    delete itemChangeMap[itemKey];

    const itemMap = { ...this.state.itemMap };
    delete itemMap[itemKey];

    this.setState({ itemChangeMap, itemMap, itemOrdering });
  };
}
