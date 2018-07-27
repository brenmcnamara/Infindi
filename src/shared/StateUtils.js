/* @flow */

import AccountStateUtils from '../data-model/state-utils/Account';

import type { Dollars } from 'common/types/core';
import type { ReduxState } from '../store';

function getNetWorth(reduxState: ReduxState): Dollars {
  return AccountStateUtils.getCollection(reduxState).reduce(
    (sum, account) => sum + account.balance,
    0,
  );
}

export default {
  getNetWorth,
};
