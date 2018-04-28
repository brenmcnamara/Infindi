/* @flow */

import ListAnimationManager from './ListAnimationManager';
import ListItem from './ListItem.react';
import React, { Component } from 'react';

import { FlatList } from 'react-native';

import type { ComponentType } from 'react';

export type ListItemData = {
  Comp: ComponentType<*>,
  height: number,
  key: string,
};

export type Props = {
  initialNumToRender: number,
  data: Array<ListItemData>,
};

export default class List extends Component<Props> {
  _animationManager = new ListAnimationManager();

  componentDidMount(): void {
    this._animationManager.listDidMount();
  }

  render() {
    return (
      <FlatList
        automaticallyAdjustContentInsets={false}
        data={this.props.data}
        initialNumToRender={this.props.initialNumToRender}
        removeClippedSubviews={false}
        renderItem={this._renderRowItem}
      />
    );
  }

  _renderRowItem = ({ index, item }) => {
    const { Comp, height } = item;
    return (
      <ListItem
        animationManager={this._animationManager}
        height={height}
        index={index}
      >
        <Comp />
      </ListItem>
    );
  };
}
