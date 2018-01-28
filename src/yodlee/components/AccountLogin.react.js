/* @flow */

import Colors from '../../design/colors';
import Icons from '../../design/icons';
import React, { Component } from 'react';
import TextButton from '../../components/shared/TextButton.react';
import TextDesign from '../../design/text';

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
  provider: YodleeProvider,
};

type RowItem = LoginEntry | { type: 'forgotPassword', url: string };

type State = {
  password: string,
  userName: string,
};

const LEFT_ARROW_WIDTH = 18;

export default class AccountLogin extends Component<Props, State> {
  state: State = {
    password: '',
    userName: '',
  };

  render() {
    const { isEditable, provider } = this.props;
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

  _renderLoginRow(data: { item: RowItem }) {
    const { item } = data;
    // $FlowFixMe - This is fine
    switch (item.type) {
      case 'text':
      case 'password': {
        return (
          <TextInput
            autoFocus={true}
            editable={this.props.isEditable}
            onChangeText={text => this._onChangeRow(item, text)}
            placeholder={item.label}
            style={styles.userNameInput}
            value={this.state.userName}
          />
        );
      }

      case 'forgotPassword': {
        // $FlowFixMe - This is fine.
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
    }
  }

  _onChangeRow = (item: LoginEntry, text: string): void => {};

  _onPressForgotCredentials = (url: string): void => {
    // TODO: Open safari at the url.
    // https://facebook.github.io/react-native/docs/linking.html
  };

  _onPressHeaderLeftIcon = (): void => {
    this.props.onBack();
  };

  _getData() {
    const { loginForm } = this.props.provider.raw;
    const rows = loginForm.row;
    /*
    const { forgetPasswordURL } = loginForm;
    if (forgetPasswordURL) {
      rows.push({ url: forgetPasswordURL, type: 'forgotPassword' });
    }
    return rows;
    */
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginTop: 32,
  },

  userNameInput: {
    borderBottomWidth: 1,
    borderColor: Colors.BORDER,
    fontFamily: TextDesign.thickFont,
    fontSize: TextDesign.largeFontSize,
    marginHorizontal: 24,
    paddingBottom: 4,
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

  passwordInput: {
    borderBottomWidth: 1,
    borderColor: Colors.BORDER,
    fontFamily: TextDesign.thickFont,
    fontSize: TextDesign.largeFontSize,
    margin: 24,
    paddingBottom: 4,
  },

  root: {
    backgroundColor: Colors.BACKGROUND,
    flex: 1,
  },
});
