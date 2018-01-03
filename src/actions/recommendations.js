/* @flow */

import type { ID } from 'common/src/types/core';

export type Action =
  | Action$FocusedRecommendationChange
  | Action$DeleteRecommendation;

export type Action$FocusedRecommendationChange = {|
  +recommendationID: ID,
  +type: 'FOCUSED_RECOMMENDATION_CHANGE',
|};

export function focusedRecommendationChange(id: ID) {
  return {
    recommendationID: id,
    type: 'FOCUSED_RECOMMENDATION_CHANGE',
  };
}

export type Action$DeleteRecommendation = {|
  +recommendationID: ID,
  +type: 'DELETE_RECOMMENDATION',
|};

export function deleteRecommendation(id: ID) {
  return {
    recommendationID: id,
    type: 'DELETE_RECOMMENDATION',
  };
}
