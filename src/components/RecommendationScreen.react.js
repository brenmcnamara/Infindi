/* @flow */

import Content from './shared/Content.react';
import React, { Component } from 'react';
import Screen from './shared/Screen.react';

import invariant from 'invariant';

import { Components } from '../recommendations';
import { connect } from 'react-redux';
import { unselectCurrentRecommendation } from '../actions/recommendations';

import type { ComponentType } from 'react';
import type { ID } from 'common/src/types/core';
import type { ReduxProps, ReduxState } from '../typesDEPRECATED/redux';

type ComponentProps = {};

type ComputedProps = {
  recommendationID: ID,
};

export type Props = ReduxProps & ComponentProps & ComputedProps;

// TODO: Add banners here.
class RecommendationScreen extends Component<Props> {
  render() {
    const { recommendationID } = this.props;
    const RecommendationComponent = Components[recommendationID];
    invariant(
      RecommendationComponent,
      'No component found for recommendation %s',
      recommendationID,
    );
    return (
      <Screen>
        <Content>
          <RecommendationComponent onNoThanks={this._onNoThanks} />
        </Content>
      </Screen>
    );
  }

  _onNoThanks = (): void => {
    this.props.dispatch(unselectCurrentRecommendation());
  };
}

function mapReduxStateToProps(state: ReduxState): ComputedProps {
  const recommendationID = state.recommendations.selectedID;
  invariant(
    recommendationID,
    'Trying to show recommendation screen without selected recommendation',
  );
  return {
    recommendationID,
  };
}

export default (connect(mapReduxStateToProps)(
  RecommendationScreen,
): ComponentType<ComponentProps>);
