/* @flow */

import * as React from 'react';

import { GetTheme } from '../../design/components/Theme.react';
import { StyleSheet, TextInput } from 'react-native';

export type Props = {
  autoFocus: boolean,
  enableInteraction: boolean,
  isPassword: boolean,
  onChangeText: (text: string) => void,
  placeholder: string,
};

export default class YodleeLoginFormInputField extends React.Component<Props> {
  render() {
    return (
      <GetTheme>
        {theme => (
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={this.props.autoFocus}
            editable={this.props.enableInteraction}
            onChangeText={this.props.onChangeText}
            placeholder={this.props.placeholder}
            secureTextEntry={this.props.isPassword}
            style={[
              styles.root,
              {
                borderColor: theme.color.borderNormal,
                fontFamily: theme.fontFamily.thick,
                fontSize: theme.fontSize.header3,
              },
            ]}
          />
        )}
      </GetTheme>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    borderBottomWidth: 1,
    marginHorizontal: 24,
    marginTop: 24,
    paddingBottom: 4,
  },
});
