/* @flow */

import type { TabType } from '../common/route-utils';
export type Action = Action$RequestTab;

export type Action$RequestTab = {|
  +tab: TabType,
  +type: 'REQUEST_TAB',
|};

export function requestTab(tab: TabType) {
  return {
    tab,
    type: 'REQUEST_TAB',
  };
}
