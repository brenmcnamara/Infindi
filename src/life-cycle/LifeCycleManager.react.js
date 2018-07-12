/* @flow */

import * as React from 'react';
import AccountActions, {
  createListener as createAccountListener,
} from '../data-model/_actions/Account';
import AccountLinkActions, {
  createListener as createAccountLinkListener,
} from '../data-model/_actions/AccountLink';
import AccountQuery from 'common/lib/models/AccountQuery';
import AccountLinkQuery from 'common/lib/models/AccountLinkQuery';
import AccountStateUtils from '../data-model/_state-utils/Account';
import Immutable from 'immutable';
import TransactionActions, {
  createCursor as createTransactionCursor,
} from '../data-model/_actions/Transaction';
import TransactionQuery from 'common/lib/models/TransactionQuery';

import invariant from 'invariant';

import { connect } from 'react-redux';
import { getUserID } from '../auth/state-utils';

import type { ID } from 'common/types/core';
import type { ReduxProps, ReduxState } from '../store';

export type Props = ReduxProps & ComponentProps & ComputedProps;

type ComponentProps = {};

type ComputedProps = {
  accountIDs: Immutable.Set<ID>,
  userID: ID | null,
};

const TRANSACTION_PAGE_SIZE = 20;

class LifeCycleManager extends React.Component<Props> {
  _accountToTransactionCursor: Immutable.Map<ID, ID> = Immutable.Map();

  _onLoginUser = (userID: ID): void => {
    const accountLinkQuery = AccountLinkQuery.forUser(userID);
    const accountLinkListener = createAccountLinkListener(accountLinkQuery);
    this.props.dispatch(AccountLinkActions.setListener(accountLinkListener));

    const accountQuery = AccountQuery.forUser(userID);
    const accountListener = createAccountListener(accountQuery);
    this.props.dispatch(AccountActions.setListener(accountListener));

    // TODO: Load providers.
  };

  _onLogoutUser = (): void => {
    this.props.dispatch(AccountLinkActions.deleteEverything());
    this.props.dispatch(AccountActions.deleteEverything());

    // TODO: Destroy providers.
  };

  _onAddAccount = (accountID: ID): void => {
    invariant(
      !this._accountToTransactionCursor.get(accountID),
      'Expecting no transaction cursor to exist for account: %s',
      accountID,
    );

    const query = TransactionQuery.orderedForAccount(accountID);
    const cursor = createTransactionCursor(query, TRANSACTION_PAGE_SIZE);
    this.props.dispatch(TransactionActions.setCursor(cursor));
    this._accountToTransactionCursor = this._accountToTransactionCursor.set(
      accountID,
      cursor.id,
    );
  };

  _onDeleteAccount = (accountID: ID): void => {
    const cursorID = this._accountToTransactionCursor.get(accountID);
    invariant(
      cursorID,
      'Expecting transaction cursor to exist for account: %s',
      accountID,
    );

    this.props.dispatch(TransactionActions.deleteCursor(cursorID));
    this._accountToTransactionCursor.delete(accountID);
  };

  componentDidUpdate(prevProps: Props): void {
    if (!prevProps.userID && this.props.userID) {
      this._onLoginUser(this.props.userID);
    } else if (prevProps.userID && !this.props.userID) {
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
    userID: getUserID(reduxState),
  };
}

export default connect(mapReduxStateToProps)(LifeCycleManager);
