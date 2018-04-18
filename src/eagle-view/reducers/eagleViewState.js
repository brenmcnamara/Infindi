/* @flow */

import type { ModelContainer } from '../../datastore';
import type { PureAction } from '../../typesDEPRECATED/redux';
import type { UserInfo } from 'common/lib/models/UserInfo';

export type State = {
  +users: ModelContainer<'UserInfo', UserInfo> | null,
};

const DEFAULT_STATE: State = {
  users: null,
};

export default function eagleViewState(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  return state;
}
