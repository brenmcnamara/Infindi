/* @flow */

import Colors from '../../design/colors';
import Icons from '../../design/icons';
import React, { Component } from 'react';
import TextButton from '../../components/shared/TextButton.react';
import TextDesign from '../../design/text';

import invariant from 'invariant';

import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavBarHeight } from '../../design/layout';

import type { LoginEntry } from 'common/types/yodlee';
import type { Provider as YodleeProvider } from 'common/lib/models/YodleeProvider';

export type Props = {
  isEditable: bool,
  onBack: () => any,
  onChangeProvider: (provider: YodleeProvider) => any,
  onPressForgotPassword: (url: string) => any,
  provider: YodleeProvider,
};

type RowItem =
  | { entryIndex: number, loginEntry: LoginEntry, type: 'LOGIN_ENTRY' }
  | { type: 'FORGOT_PASSWORD', url: string };

const LEFT_ARROW_WIDTH = 18;

export default class AccountLogin extends Component<Props> {
  render() {
    const { provider } = this.props;
    const { raw: rawProvider } = provider;

    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <TouchableOpacity onPress={this._onPressHeaderLeftIcon}>
            <Image
              resizeMode="contain"
              source={Icons.LeftArrow}
              style={styles.headerLeftIcon}
            />
          </TouchableOpacity>
          <Text style={[TextDesign.header3, styles.headerTitle]}>
            {rawProvider.name}
          </Text>
          <View style={styles.headerRightIcon} />
        </View>
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
            autoFocus={true}
            editable={this.props.isEditable}
            onChangeText={text =>
              this._onChangeRow(loginEntry, entryIndex, text)
            }
            placeholder={loginEntry.label}
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

  _onPressHeaderLeftIcon = (): void => {
    this.props.onBack();
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

  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.BORDER_HAIRLINE,
    flexDirection: 'row',
    height: NavBarHeight,
  },

  headerLeftIcon: {
    marginLeft: 16,
    width: LEFT_ARROW_WIDTH,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },

  headerRightIcon: {
    marginRight: 16,
    width: LEFT_ARROW_WIDTH,
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
