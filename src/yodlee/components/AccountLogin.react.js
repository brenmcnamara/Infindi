/* @flow */

import Colors from '../../design/colors';
import React, { Component } from 'react';
import TextButton from '../../components/shared/TextButton.react';
import TextDesign from '../../design/text';

import invariant from 'invariant';

import { FlatList, StyleSheet, TextInput, View } from 'react-native';

import type { LoginEntry } from 'common/types/yodlee';
import type { Provider as YodleeProvider } from 'common/lib/models/YodleeProvider';

export type Props = {
  isEditable: bool,
  onChangeProvider: (provider: YodleeProvider) => any,
  onPressForgotPassword: (url: string) => any,
  provider: YodleeProvider,
};

type RowItem =
  | { entryIndex: number, loginEntry: LoginEntry, type: 'LOGIN_ENTRY' }
  | { type: 'FORGOT_PASSWORD', url: string };

export default class AccountLogin extends Component<Props> {
  render() {
    return (
      <View style={styles.root}>
        <View style={styles.content}>
          <FlatList
            data={this._getData()}
            keyExtractor={(_, index) => String(index)}
            keyboardShouldPersistTaps="always"
            renderItem={this._renderLoginRow}
          />
        </View>
      </View>
    );
  }

  _renderLoginRow = (data: { item: RowItem }) => {
    const { item } = data;

    switch (item.type) {
      case 'LOGIN_ENTRY': {
        const { entryIndex, loginEntry } = item;
        const field = loginEntry.field[0];
        return (
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
            editable={this.props.isEditable}
            onChangeText={text =>
              this._onChangeRow(loginEntry, entryIndex, text)
            }
            placeholder={loginEntry.label}
            secureTextEntry={field.type === 'password'}
            style={styles.loginEntryRow}
            value={field.value}
          />
        );
      }

      case 'FORGOT_PASSWORD': {
        const { url } = item;
        return (
          <TextButton
            onPress={() => this._onPressForgotCredentials(url)}
            size="SMALL"
            type="SPECIAL"
            text="Forgot username or password?"
          />
        );
      }

      default:
        invariant(false, 'Unrecognized row item: %s', item.type);
    }
  };

  _onChangeRow = (entry: LoginEntry, index: number, text: string): void => {
    const field = [
      {
        ...entry.field[0],
        value: text,
      },
    ].concat(entry.field.slice(1));
    const newEntry = {
      ...entry,
      field,
    };

    const { provider } = this.props;
    const row = provider.raw.loginForm.row.slice();
    row.splice(index, 1, newEntry);
    const loginForm = { ...provider.raw.loginForm, row };
    const raw = { ...provider.raw, loginForm };
    this.props.onChangeProvider({ ...provider, raw });
  };

  _onPressForgotCredentials = (url: string): void => {
    this.props.onPressForgotPassword(url);
  };

  _getData() {
    const { loginForm } = this.props.provider.raw;
    const rows: Array<RowItem> = loginForm.row.map((loginEntry, index) => ({
      entryIndex: index,
      loginEntry,
      type: 'LOGIN_ENTRY',
    }));

    const { forgetPasswordURL } = loginForm;
    if (forgetPasswordURL) {
      rows.push({ url: forgetPasswordURL, type: 'FORGOT_PASSWORD' });
    }
    return rows;
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginTop: 32,
  },

  loginEntryRow: {
    borderBottomWidth: 1,
    borderColor: Colors.BORDER,
    fontFamily: TextDesign.thickFont,
    fontSize: TextDesign.largeFontSize,
    marginBottom: 24,
    marginHorizontal: 24,
    paddingBottom: 4,
  },

  root: {
    backgroundColor: Colors.BACKGROUND,
    flex: 1,
  },
});
