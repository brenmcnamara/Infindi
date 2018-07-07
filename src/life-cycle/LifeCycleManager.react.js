/* @flow */

import * as React from 'react';
import AccountLink from 'common/lib/models/AccountLink';
import AccountLinkActions, {
  createListener as createAccountLinkListener,
} from '../data-model/_actions/AccountLink';

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
  _performLogin = (userID: ID): void => {
    const query = AccountLink.FirebaseCollectionUNSAFE.where(
      'userRef.refID',
      '==',
      userID,
    );
    const listener = createAccountLinkListener(query);
    this.props.dispatch(AccountLinkActions.setListener(listener));
  };

  _performLogout = (): void => {};

  componentDidUpdate(prevProps: Props): void {
    if (!prevProps.userID && this.props.userID) {
      this._performLogin(this.props.userID);
    } else if (prevProps.userID && !this.props.userID) {
      this._performLogout();
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
