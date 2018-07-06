/* @flow */

import Account from 'common/lib/models/Account';

import {generateReducer} from './Reducer';

import type {AccountRaw} from 'common/lib/models/Account';
import type {State as StateTemplate} from './Reducer';

export type State = StateTemplate<'Account', AccountRaw, Account>;

export default generateReducer(Account);
