/* @flow */

import * as React from 'react';
import AccountActions, {
  createListener as createAccountListener,
} from '../data-model/actions/Account';
import AccountLinkActions, {
  createListener as createAccountLinkListener,
} from '../data-model/actions/AccountLink';
import AccountQuery from 'common/lib/models/AccountQuery';
import AccountLinkQuery from 'common/lib/models/AccountLinkQuery';
import AccountStateUtils from '../data-model/state-utils/Account';
import Immutable from 'immutable';
import LifeCycleActions from './Actions';
import TransactionActions, {
  createCursor as createTransactionCursor,
} from '../data-model/actions/Transaction';
import TransactionQuery from 'common/lib/models/TransactionQuery';
import UserInfo from 'common/lib/models/UserInfo';
import UserInfoActions, {
  createOperation as createUserInfoOperation,
} from '../data-model/actions/UserInfo';

import invariant from 'invariant';

import { connect } from 'react-redux';
import { getUserInfo } from '../auth/state-utils';

import type { ID } from 'common/types/core';
import type { ReduxProps, ReduxState } from '../store';
// eslint-disable-next-line max-len
import type { State as State$AccountToTransactionCursor } from './reducers/accountToTransactionCursor';

export type Props = ReduxProps & ComponentProps & ComputedProps;

type ComponentProps = {};

type ComputedProps = {
  accountIDs: Immutable.Set<ID>,
  accountToTransactionCursor: State$AccountToTransactionCursor,
  userInfo: UserInfo | null,
};

const TRANSACTION_PAGE_SIZE = 20;

class LifeCycleManager extends React.Component<Props> {
  _onLoginUser = (userInfo: UserInfo): void => {
    const accountLinkQuery = AccountLinkQuery.forUser(userInfo.id);
    const accountLinkListener = createAccountLinkListener(accountLinkQuery);
    this.props.dispatch(
      AccountLinkActions.setAndRunListener(accountLinkListener),
    );

    const accountQuery = AccountQuery.forUser(userInfo.id);
    const accountListener = createAccountListener(accountQuery);
    this.props.dispatch(AccountActions.setAndRunListener(accountListener));

    // TODO: Load providers.

    if (userInfo.isAdmin) {
      const userInfoQuery = UserInfo.FirebaseCollectionUNSAFE;
      const userInfoOperation = createUserInfoOperation(userInfoQuery);
      this.props.dispatch(
        UserInfoActions.setAndRunOperation(userInfoOperation),
      );
    }
  };

  _onLogoutUser = (): void => {
    this.props.dispatch(AccountLinkActions.deleteEverything());
    this.props.dispatch(AccountActions.deleteEverything());
    // TODO: Destroy providers.
    this.props.dispatch(UserInfoActions.deleteEverything());
  };

  _onAddAccount = (accountID: ID): void => {
    invariant(
      !this.props.accountToTransactionCursor.get(accountID),
      'Expecting no transaction cursor to exist for account: %s',
      accountID,
    );

    const query = TransactionQuery.orderedForAccount(accountID);
    const cursor = createTransactionCursor(query, TRANSACTION_PAGE_SIZE);
    this.props.dispatch(TransactionActions.setCursor(cursor));
    this.props.dispatch(
      LifeCycleActions.addAccountToTransactionCursorPair(accountID, cursor.id),
    );
  };

  _onDeleteAccount = (accountID: ID): void => {
    const cursorID = this.props.accountToTransactionCursor.get(accountID);
    invariant(
      cursorID,
      'Expecting transaction cursor to exist for account: %s',
      accountID,
    );

    this.props.dispatch(TransactionActions.deleteCursor(cursorID));
    this.props.dispatch(
      LifeCycleActions.removeAccountToTransactionCursorPair(accountID),
    );
  };

  componentDidUpdate(prevProps: Props): void {
    if (!prevProps.userInfo && this.props.userInfo) {
      this._onLoginUser(this.props.userInfo);
    } else if (prevProps.userInfo && !this.props.userInfo) {
      this._onLogoutUser();
    }

    this.props.accountIDs.forEach(accountID => {
      if (!prevProps.accountIDs.has(accountID)) {
        this._onAddAccount(accountID);
      }
    });

    prevProps.accountIDs.forEach(accountID => {
      if (!this.props.accountIDs.has(accountID)) {
        this._onDeleteAccount(accountID);
      }
    });
  }

  render() {
    return null;
  }
}

function mapReduxStateToProps(reduxState: ReduxState): ComputedProps {
  // TODO: This is a good candidate for reselect library, to optimize the
  // creation of the immutable set based on the parameter.
  const accountIDs = Immutable.Set(
    AccountStateUtils.getCollection(reduxState).keys(),
  );

  return {
    accountIDs,
    accountToTransactionCursor: reduxState.accountToTransactionCursor,
    userInfo: getUserInfo(reduxState),
  };
}

export default connect(mapReduxStateToProps)(LifeCycleManager);
