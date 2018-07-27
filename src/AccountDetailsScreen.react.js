/* @flow */

import Content from './shared/Content.react';
import Icons from './design/icons';
import LifeCycleStateUtils from './life-cycle/StateUtils';
import MoneyText from './shared/MoneyText.react';
import React, { Component } from 'react';
import Screen from './shared/Screen.react';
import TextButton from './shared/TextButton.react';
import TransactionActions from './data-model/actions/Transaction';
import TransactionStateUtils from './data-model/state-utils/Transaction';

import invariant from 'invariant';
import moment from 'moment';

import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { GetTheme } from './design/components/Theme.react';
import { throttle } from './common/generic-utils';
import { TransactionEmpty, TransactionLoadingError } from '../content';

import type Transaction, {
  TransactionOrderedCollection,
} from 'common/lib/models/Transaction';

import type { ID } from 'common/types/core';
import type { ModelCursorState } from './data-model/types';
import type { ReduxProps, ReduxState } from './store';
import type { Theme } from './design/themes';

export type Props = ReduxProps & ComponentProps & ComputedProps;

type ComponentProps = {};

type ComputedProps = {
  accountID: ID,
  transactionCursorState: ModelCursorState<'Transaction'>,
  transactions: TransactionOrderedCollection,
};

class AccountDetailsScreen extends Component<Props> {
  _shouldAllowBackButton: boolean = false;

  componentWillMount(): void {
    const { dispatch, transactionCursorState } = this.props;
    if (
      !transactionCursorState.didReachEnd &&
      transactionCursorState.modelIDs.size <= 0
    ) {
      const { cursorID } = transactionCursorState;
      dispatch(TransactionActions.fetchCursorPage(cursorID));
    }
  }

  render() {
    return (
      <GetTheme>
        {(theme: Theme) => (
          <Screen>
            <Content>{this._renderList(theme)}</Content>
          </Screen>
        )}
      </GetTheme>
    );
  }

  _renderList(theme: Theme) {
    return (
      <FlatList
        data={this._getListData()}
        renderItem={this._renderListItem}
        style={styles.list}
      />
    );
  }

  _renderListItem = ({ item }) => {
    return item.render();
  };

  _renderTransactionHeader = () => {
    return (
      <GetTheme>
        {(theme: Theme) => (
          <View
            style={[
              styles.transactionHeader,
              { borderColor: theme.color.borderNormal },
            ]}
          >
            <Text style={theme.getTextStyleNormal()}>Transactions</Text>
          </View>
        )}
      </GetTheme>
    );
  };

  _renderTransaction = (transaction: Transaction, showTopBorder: boolean) => {
    return (
      <GetTheme>
        {(theme: Theme) => (
          <View
            style={[
              styles.transaction,
              {
                backgroundColor: theme.color.backgroundListItem,
                borderColor: theme.color.borderNormal,
                borderTopWidth: showTopBorder ? 1 : 0,
              },
            ]}
          >
            <View style={styles.transactionTop}>
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={[
                  theme.getTextStyleNormalWithEmphasis(),
                  styles.transactionTitle,
                ]}
              >
                {transaction.title}
              </Text>
              <MoneyText
                dollars={transaction.amount}
                textStyle={[
                  styles.transactionAmount,
                  theme.getTextStyleNormalWithEmphasis(),
                ]}
              />
            </View>
            <View style={styles.transactionBottom}>
              <Text
                style={[theme.getTextStyleSmall(), styles.transactionCategory]}
              >
                {transaction.category.toUpperCase()}
              </Text>
              <Text style={[theme.getTextStyleSmall(), styles.transactionDate]}>
                {moment(transaction.transactionDate).format('l')}
              </Text>
            </View>
          </View>
        )}
      </GetTheme>
    );
  };

  _renderTransactionLoadMoreButton = () => {
    return (
      <GetTheme>
        {(theme: Theme) => (
          <View style={styles.listItemLoadeMore}>
            <TextButton
              onPress={this._onPressLoadMore}
              size="LARGE"
              text="Load More..."
              type="SPECIAL"
            />
          </View>
        )}
      </GetTheme>
    );
  };

  _renderTransactionEmpty = () => {
    return (
      <GetTheme>
        {(theme: Theme) => (
          <View style={styles.listItemWithCenteredContent}>
            <Text style={[theme.getTextStyleNormal(), styles.transactionEmpty]}>
              {TransactionEmpty}
            </Text>
          </View>
        )}
      </GetTheme>
    );
  };

  _renderTransactionLoadingSpiral = () => {
    return (
      <View style={styles.listItemWithCenteredContent}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  _renderTransactionError = () => {
    return (
      <GetTheme>
        {(theme: Theme) => (
          <View style={styles.listItemWithCenteredContent}>
            <Text style={[theme.getTextStyleAlert(), styles.errorText]}>
              {TransactionLoadingError}
            </Text>
            <Image
              resizeMode="contain"
              source={Icons.Error}
              style={styles.errorIcon}
            />
          </View>
        )}
      </GetTheme>
    );
  };

  _onPressLoadMore = throttle(50, (): void => {
    const { dispatch, transactionCursorState } = this.props;
    if (transactionCursorState.loadState.type === 'STEADY') {
      const { cursorID } = transactionCursorState;
      dispatch(TransactionActions.fetchCursorPage(cursorID));
    }
  });

  _getKeyExtractor = item => {
    return item.key;
  };

  _getListData() {
    const { transactions, transactionCursorState } = this.props;
    const { didReachEnd, loadState } = transactionCursorState;
    const data = [
      { key: 'TRANSACTION_HEADER', render: this._renderTransactionHeader },
    ];

    let isFirstTransaction = true;
    transactions.forEach(transaction => {
      data.push({
        key: `TRANSACTION_${transaction.id}`,
        render: () => this._renderTransaction(transaction, isFirstTransaction),
      });
      isFirstTransaction = false;
    });

    if (transactions.size > 0 && loadState.type === 'STEADY' && !didReachEnd) {
      data.push({
        key: 'TRANSACTION_LOAD_MORE_BUTTON',
        render: () => this._renderTransactionLoadMoreButton(),
      });
    }

    if (loadState.type === 'EMPTY' || (didReachEnd && transactions.size <= 0)) {
      data.push({
        key: 'TRANSACTION_EMPTY',
        render: this._renderTransactionEmpty,
      });
    }

    if (loadState.type === 'LOADING') {
      data.push({
        key: 'TRANSACTION_LOADING',
        render: this._renderTransactionLoadingSpiral,
      });
    }

    if (loadState.type === 'FAILURE') {
      data.push({
        key: 'TRANSACTION_ERROR',
        render: this._renderTransactionError,
      });
    }

    return data;
  }
}

function mapReduxStateToProps(reduxState: ReduxState): ComputedProps {
  const accountID = reduxState.navigation.accountDetailsID;
  invariant(
    accountID,
    'Expecting accountID to exist when trying to render AccountDetailsScreen',
  );
  const transactionCursorState = LifeCycleStateUtils.getTransactionCursorState(
    reduxState,
    accountID,
  );
  invariant(
    transactionCursorState,
    'Expecting transaction cursor to exist for account id: %s',
    accountID,
  );
  const { cursorID } = transactionCursorState;
  return {
    accountID,
    transactionCursorState,
    // TODO: Reselect
    transactions: TransactionStateUtils.getOrderedCollectionForCursor(
      reduxState,
      cursorID,
    ),
  };
}

export default connect(mapReduxStateToProps)(AccountDetailsScreen);

const styles = StyleSheet.create({
  errorIcon: {},

  errorText: {
    marginVertical: 8,
    textAlign: 'center',
  },

  list: {
    marginHorizontal: 4,
    marginTop: 16,
  },

  listItemLoadeMore: {
    marginVertical: 16,
  },

  listItemWithCenteredContent: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
  },

  transaction: {
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    padding: 8,
  },

  transactionAmount: {},

  transactionBottom: {
    flexDirection: 'row',
    marginTop: 8,
  },

  transactionCategory: {
    flex: 1,
  },

  transactionDate: {},

  transactionEmpty: {
    textAlign: 'center',
  },

  transactionHeader: {
    borderBottomWidth: 1,
    marginBottom: 4,
    paddingVertical: 4,
  },

  transactionTitle: {
    flex: 1,
    marginRight: 12,
  },

  transactionTop: {
    flexDirection: 'row',
  },
});
