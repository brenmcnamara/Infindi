/* @flow */

import * as React from 'react';
import AccountActions from '../data-model/actions/Account';
import AccountDataUtils from '../data-model/data-utils/Account';
import AccountLinkActions from '../data-model/actions/AccountLink';
import AccountLinkDataUtils from '../data-model/data-utils/AccountLink';
import AccountQuery from 'common/lib/models/AccountQuery';
import AccountLinkQuery from 'common/lib/models/AccountLinkQuery';
import AccountStateUtils from '../data-model/state-utils/Account';
import AuthStateUtils from '../auth/StateUtils';
import Immutable from 'immutable';
import LifeCycleActions from './Actions';
import ProviderFuzzySearchActions from '../data-model/actions/ProviderFuzzySearch';
import TransactionActions from '../data-model/actions/Transaction';
import TransactionDataUtils from '../data-model/data-utils/Transaction';
import UserInfo from 'common/lib/models/UserInfo';
import UserInfoActions from '../data-model/actions/UserInfo';
import UserInfoDataUtils from '../data-model/data-utils/UserInfo';
import UserInfoStateUtils from '../data-model/state-utils/UserInfo';

import invariant from 'invariant';
import nullthrows from 'nullthrows';

import { connect } from 'react-redux';

import type { ID } from 'common/types/core';
import type { ReduxProps, ReduxState } from '../store';

import Transaction from 'common/lib/models/Transaction';

export type Props = ReduxProps & ComponentProps & ComputedProps;

type ComponentProps = {};

type ComputedProps = {
  accountIDs: Immutable.Set<ID>,
  accountToTransactionCursor: Immutable.Map<ID, ID>,
  activeUserInfo: UserInfo | null,
  loggedInUserInfo: UserInfo | null,
};

const TRANSACTION_PAGE_SIZE = 20;

class LifeCycleManager extends React.Component<Props> {
  _onLoginUser = (userInfo: UserInfo): void => {
    if (userInfo.isAdmin) {
      const userInfoQuery = {
        handle: UserInfo.FirebaseCollectionUNSAFE,
        type: 'COLLECTION_QUERY',
      };
      const userInfoOperation = UserInfoDataUtils.createOperation(
        userInfoQuery,
      );
      this.props.dispatch(
        UserInfoActions.setAndRunOperation(userInfoOperation),
      );
    }
  };

  _onLogoutUser = (): void => {
    this.props.dispatch(UserInfoActions.clearReduxState());
  };

  _onAddActiveUser = (userInfo: UserInfo): void => {
    const accountLinkQuery = AccountLinkQuery.Collection.forUser(userInfo.id);
    const accountLinkListener = AccountLinkDataUtils.createListener(
      accountLinkQuery,
    );
    this.props.dispatch(
      AccountLinkActions.setAndRunListener(accountLinkListener),
    );

    const accountQuery = AccountQuery.Collection.forUser(userInfo.id);
    const accountListener = AccountDataUtils.createListener(accountQuery);
    this.props.dispatch(AccountActions.setAndRunListener(accountListener));

    this.props.dispatch(ProviderFuzzySearchActions.fetchProviders(''));
  };

  _onRemoveActiveUser = (): void => {
    this.props.dispatch(AccountActions.clearReduxState());
    this.props.dispatch(AccountLinkActions.clearReduxState());
  };

  _onAddAccount = (userID: ID, accountID: ID): void => {
    invariant(
      !this.props.accountToTransactionCursor.get(accountID),
      'Expecting no transaction cursor to exist for account: %s',
      accountID,
    );

    const query = createTransactionQuery(userID, accountID);
    const cursor = TransactionDataUtils.createCursor(
      query,
      TRANSACTION_PAGE_SIZE,
    );
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
    if (!prevProps.loggedInUserInfo && this.props.loggedInUserInfo) {
      this._onLoginUser(this.props.loggedInUserInfo);
    } else if (prevProps.loggedInUserInfo && !this.props.loggedInUserInfo) {
      this._onRemoveActiveUser();
      this._onLogoutUser();
    }

    if (this.props.activeUserInfo !== prevProps.activeUserInfo) {
      if (prevProps.activeUserInfo) {
        this._onRemoveActiveUser();
      }
      if (this.props.activeUserInfo) {
        this._onAddActiveUser(this.props.activeUserInfo);
      }
    }

    this.props.accountIDs.forEach(accountID => {
      if (!prevProps.accountIDs.has(accountID)) {
        this._onAddAccount(
          nullthrows(this.props.loggedInUserInfo).id,
          accountID,
        );
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

  const {
    accountToTransactionCursor,
    watchSessionActiveUserID,
  } = reduxState.lifeCycle;

  return {
    accountIDs,
    accountToTransactionCursor,
    activeUserInfo: watchSessionActiveUserID
      ? UserInfoStateUtils.getModelNullthrows(
          reduxState,
          watchSessionActiveUserID,
        )
      : AuthStateUtils.getUserInfo(reduxState),
    loggedInUserInfo: AuthStateUtils.getUserInfo(reduxState),
  };
}

export default connect(mapReduxStateToProps)(LifeCycleManager);

// NOTE: Getting permission issues with certain transaction queries. Need
// to include userRef.refID in the query or firebase will create a permission
// denied exception, even though the query returns the same result with and
// without the userRef.refID filter. I suspect this is as a result of indexing.
function createTransactionQuery(
  userID: ID,
  accountID: ID,
): ModelOrderedCollectionQuery {
  return {
    handle: Transaction.FirebaseCollectionUNSAFE.where(
      'userRef.refID',
      '==',
      userID,
    )
      .where('accountRef.refID', '==', accountID)
      .orderBy('transactionDate', 'desc')
      .orderBy('id'),
    type: 'ORDERED_COLLECTION_QUERY',
  };
}
