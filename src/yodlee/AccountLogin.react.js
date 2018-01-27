/* @flow */

import Colors from '../design/colors';
import Icons from '../design/icons';
import React, { Component } from 'react';
import TextButton from '../components/shared/TextButton.react';
import TextDesign from '../design/text';

import invariant from 'invariant';

import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavBarHeight } from '../design/layout';

import type { Provider as YodleeProvider } from 'common/lib/models/YodleeProvider';

export type Props = {
  isEditable: bool,
  onBack: () => any,
  provider: YodleeProvider,
};

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
          <TextInput
            autoFocus={true}
            editable={isEditable}
            onChangeText={this._onChangeUserName}
            placeholder="Username"
            style={styles.userNameInput}
            value={this.state.userName}
          />
          <TextInput
            onChangeText={this._onChangePassword}
            editable={isEditable}
            placeholder="Password"
            secureTextEntry={true}
            style={styles.passwordInput}
            value={this.state.password}
          />
          {Boolean(rawProvider.forgetPasswordUrl) && (
            <TextButton
              onPress={this._onPressForgotCredentials}
              size="SMALL"
              type="SPECIAL"
              text="Forgot username or password?"
            />
          )}
        </View>
      </View>
    );
  }

  _onChangeUserName = (text: string): void => {
    this.setState({ userName: text });
  };

  _onChangePassword = (text: string): void => {
    this.setState({ password: text });
  };

  _onPressForgotCredentials = (): void => {
    const { forgetPasswordUrl } = this.props.provider.raw;
    invariant(forgetPasswordUrl, 'Cannot select forget password without url');
    // TODO: Open safari at the url.
    // https://facebook.github.io/react-native/docs/linking.html
  };

  _onPressHeaderLeftIcon = (): void => {
    this.props.onBack();
  };
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
