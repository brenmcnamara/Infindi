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

import { connect } from 'react-redux';
import { getUserID } from '../auth/state-utils';

import type { ID } from 'common/types/core';
import type { ReduxProps, ReduxState } from '../store';

export type Props = ReduxProps & ComponentProps & ComputedProps;

type ComponentProps = {};

type ComputedProps = {
  userID: ID | null,
};

class LifeCycleManager extends React.Component<Props> {
  _didLoginUser = (userID: ID): void => {
    const accountLinkQuery = AccountLinkQuery.forUser(userID);
    const accountLinkListener = createAccountLinkListener(accountLinkQuery);
    this.props.dispatch(AccountLinkActions.setListener(accountLinkListener));

    const accountQuery = AccountQuery.forUser(userID);
    const accountListener = createAccountListener(accountQuery);
    this.props.dispatch(AccountActions.setListener(accountListener));

    // TODO: Load providers.
  };

  _didLogoutUser = (): void => {
    this.props.dispatch(AccountLinkActions.deleteEverything());
    this.props.dispatch(AccountActions.deleteEverything());

    // TODO: Destroy providers.
  };

  componentDidUpdate(prevProps: Props): void {
    if (!prevProps.userID && this.props.userID) {
      this._didLoginUser(this.props.userID);
    } else if (prevProps.userID && !this.props.userID) {
      this._didLogoutUser();
    }
  }

  render() {
    return null;
  }
}

function mapReduxStateToProps(reduxState: ReduxState): ComputedProps {
  return {
    userID: getUserID(reduxState),
  };
}

export default connect(mapReduxStateToProps)(LifeCycleManager);
