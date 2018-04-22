/* @flow */

import Content from './shared/Content.react';
import DataModelActions from '../data-model/actions';
import DataModelStateUtils from '../data-model/state-utils';
import Icons from '../design/icons';
import MoneyText from './shared/MoneyText.react';
import React, { Component } from 'react';
import Screen from './shared/Screen.react';

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
import {
  getAmount,
  getCategory,
  getTitle,
} from 'common/lib/models/Transaction';
import { GetTheme } from '../design/components/Theme.react';
import { TransactionEmpty, TransactionLoadingError } from '../../content';

import type { ID } from 'common/types/core';
import type { ReduxProps } from '../store';
import type { State as ReduxState } from '../reducers/root';
import type { Theme } from '../design/themes';
import type { Transaction } from 'common/lib/models/Transaction';
import type { TransactionLoadingStatus } from '../data-model/types';

export type Props = ReduxProps & ComponentProps & ComputedProps;

type ComponentProps = {
  accountID: ID,
};

type ComputedProps = {
  cursor: Object | null,
  loadingStatus: TransactionLoadingStatus,
  transactions: Array<Transaction>,
};

class AccountDetailsScreen extends Component<Props> {
  _shouldAllowBackButton: boolean = false;

  componentDidMount(): void {}

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
        onEndReached={this._onEndReached}
        onEndReachedThreshold={5}
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
                {getTitle(transaction)}
              </Text>
              <MoneyText
                dollars={getAmount(transaction)}
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
                {getCategory(transaction).toUpperCase()}
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

  _onEndReached = (): void => {
    const { accountID, cursor, loadingStatus } = this.props;
    if (loadingStatus === 'STEADY') {
      invariant(
        cursor,
        'Transactions must have cursor if loading status is "STEADY"',
      );
      this.props.dispatch(
        DataModelActions.fetchTransactions(accountID, cursor),
      );
    }
  };

  _getKeyExtractor = item => {
    return item.key;
  };

  _getListData() {
    const { loadingStatus, transactions } = this.props;
    const data = [
      { key: 'TRANSACTION_HEADER', render: this._renderTransactionHeader },
    ];

    transactions.forEach((transaction, index) => {
      data.push({
        key: `TRANSACTION_${transaction.id}`,
        render: () => this._renderTransaction(transaction, index === 0),
      });
    });

    if (
      loadingStatus === 'EMPTY' ||
      (loadingStatus === 'END_OF_INPUT' && transactions.length === 0)
    ) {
      data.push({
        key: 'TRANSACTION_EMPTY',
        render: this._renderTransactionEmpty,
      });
    }

    if (loadingStatus === 'LOADING') {
      data.push({
        key: 'TRANSACTION_LOADING',
        render: this._renderTransactionLoadingSpiral,
      });
    }

    if (loadingStatus === 'FAILURE') {
      data.push({
        key: 'TRANSACTION_ERROR',
        render: this._renderTransactionError,
      });
    }

    return data;
  }
}

function mapReduxStateToProps(
  state: ReduxState,
  props: ComponentProps,
): ComputedProps {
  return {
    cursor: DataModelStateUtils.getCursorForAccount(state, props.accountID),
    loadingStatus: DataModelStateUtils.getTransactionLoadingStatus(
      state,
      props.accountID,
    ),
    transactions: DataModelStateUtils.getTransactionsForAccount(
      state,
      props.accountID,
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
