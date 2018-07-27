/* @flow */

import Content from '../shared/components/Content.react';
import React, { Component } from 'react';
import Screen from '../shared/components/Screen.react';

import invariant from 'invariant';

import { Components } from '../action-items';
import { connect } from 'react-redux';
import { unselectCurrentActionItem } from './Actions';

import type { ComponentType } from 'react';
import type { ID } from 'common/types/core';
import type { ReduxProps, ReduxState } from '../store';

type ComponentProps = {};

type ComputedProps = {
  actionItemID: ID,
};

export type Props = ReduxProps & ComponentProps & ComputedProps;

// TODO: Add banners here.
class ActionItemScreen extends Component<Props> {
  render() {
    const { actionItemID } = this.props;
    const ActionItemComponent = Components[actionItemID];
    invariant(
      ActionItemComponent,
      'No component found for action item %s',
      actionItemID,
    );
    return (
      <Screen>
        <Content>
          <ActionItemComponent onNoThanks={this._onNoThanks} />
        </Content>
      </Screen>
    );
  }

  _onNoThanks = (): void => {
    this.props.dispatch(unselectCurrentActionItem());
  };
}

function mapReduxStateToProps(state: ReduxState): ComputedProps {
  const actionItemID = state.actionItems.selectedID;
  invariant(
    actionItemID,
    'Trying to show action item screen without selected action item',
  );
  return {
    actionItemID,
  };
}

// eslint-disable-next-line flowtype/generic-spacing
export default (connect(mapReduxStateToProps)(ActionItemScreen): ComponentType<
  ComponentProps,
>);
