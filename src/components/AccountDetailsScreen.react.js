/* @flow */

import Content from './shared/Content.react';
import Colors from '../design/colors';
import Icons from '../design/icons';
import MoneyText from './shared/MoneyText.react';
import React, { Component } from 'react';
import Screen from './shared/Screen.react';
import TextDesign from '../design/text';
import TransactionActions from '../data-model/actions/transactions';
import TransactionState from '../data-model/state/transactions';

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
import {
  getTransactionsForAccount,
  getTransactionLoadingStatus,
} from '../common/state-utils';
import { TransactionEmpty, TransactionLoadingError } from '../../content';

import type { ID } from 'common/types/core';
import type { ReduxProps } from '../typesDEPRECATED/redux';
import type { State as ReduxState } from '../reducers/root';
import type { Transaction } from 'common/lib/models/Transaction';
import type { TransactionLoadingStatus } from '../reducers/transactionLoading';

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
  _shouldAllowBackButton: bool = false;

  componentDidMount(): void {

  }

  render() {
    return (
      <Screen>
        <Content>{this._renderList()}</Content>
      </Screen>
    );
  }

  _renderList() {
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
      <View style={styles.transactionHeader}>
        <Text style={TextDesign.normal}>Transactions</Text>
      </View>
    );
  };

  _renderTransaction = (transaction: Transaction, showTopBorder: bool) => {
    return (
      <View
        style={[styles.transaction, { borderTopWidth: showTopBorder ? 1 : 0 }]}
      >
        <View style={styles.transactionTop}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={[TextDesign.normalWithEmphasis, styles.transactionTitle]}
          >
            {getTitle(transaction)}
          </Text>
          <MoneyText
            dollars={getAmount(transaction)}
            textStyle={[
              styles.transactionAmount,
              TextDesign.normalWithEmphasis,
            ]}
          />
        </View>
        <View style={styles.transactionBottom}>
          <Text style={[TextDesign.small, styles.transactionCategory]}>
            {getCategory(transaction).toUpperCase()}
          </Text>
          <Text style={[TextDesign.small, styles.transactionDate]}>
            {moment(transaction.transactionDate).format('l')}
          </Text>
        </View>
      </View>
    );
  };

  _renderTransactionEmpty = () => {
    return (
      <View style={styles.listItemWithCenteredContent}>
        <Text style={[TextDesign.normal, styles.transactionEmpty]}>
          {TransactionEmpty}
        </Text>
      </View>
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
      <View style={styles.listItemWithCenteredContent}>
        <Text style={[TextDesign.error, styles.errorText]}>
          {TransactionLoadingError}
        </Text>
        <Image
          resizeMode="contain"
          source={Icons.Error}
          style={styles.errorIcon}
        />
      </View>
    );
  };

  _onEndReached = (): void => {
    const { accountID, cursor, loadingStatus } = this.props;
    if (loadingStatus === 'STEADY') {
      invariant(
        cursor,
        'Transactions must have cursor if loading status is "STEADY"',
      );
      this.props.dispatch(TransactionActions.fetchTransactions(accountID, cursor));
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
    cursor: TransactionState.getCursorForAccount(state, props.accountID),
    loadingStatus: getTransactionLoadingStatus(state, props.accountID),
    transactions: getTransactionsForAccount(state, props.accountID),
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
    backgroundColor: Colors.BACKGROUND_LIGHT,
    borderBottomWidth: 1,
    borderColor: Colors.BORDER,
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
    borderColor: Colors.BORDER,
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
