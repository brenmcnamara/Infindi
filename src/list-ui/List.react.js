/* @flow */

import ListItem from './ListItem.react';
import ListItemAnimationManager from './ListItemAnimationManager';
import React, { Component } from 'react';

import { FlatList } from 'react-native';

import type { ComponentType } from 'react';

export type ListItemData = {
  Comp: ComponentType<*>,
  key: string,
};

export type Props = {
  initialNumToRender: number,
  data: Array<ListItemData>,
};

export default class List extends Component<Props> {
  _animationManager = new ListItemAnimationManager();

  componentDidMount(): void {
    this._animationManager.listDidMount();
  }

  render() {
    return (
      <FlatList
        automaticallyAdjustContentInsets={false}
        data={this.props.data}
        initialNumToRender={20}
        removeClippedSubviews={false}
        renderItem={this._renderRowItem}
      />
    );
  }

  _renderRowItem = ({ index, item }) => {
    const { Comp } = item;
    return (
      <ListItem animationManager={this._animationManager} index={index}>
        <Comp />
      </ListItem>
    );
  };
}
