/* @flow */

import ListItem from './ListItem.react';
import React, { Component } from 'react';

import { FlatList } from 'react-native';

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

type State = {
  initializeCount: number,
  itemOrdering: Array<string>,
  itemMap: { [key: string]: ListItemData },
};

export default class List extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = this._calculateState(props, /* isInitializing */ true);
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
    const { Comp, height } = item;
    return (
      <ListItem height={height} index={index}>
        <Comp />
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
    data.forEach(item => {
      itemMap[item.key] = item;
    });

    return {
      itemMap,
      itemOrdering,
    };
  }

  _keyExtractor = (key: string) => key;
}
