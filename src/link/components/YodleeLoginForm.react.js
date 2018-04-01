/* @flow */

import Colors from '../../design/colors';
import Icons from '../../design/icons';
import React, { Component } from 'react';
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

import type {
  LoginField,
  LoginField$General,
  LoginField$Option,
  LoginField$TextOrPassword,
  LoginForm,
  LoginRow,
} from 'common/types/yodlee';

export type Props = {
  isEditable: bool,
  loginForm: LoginForm,
  onChangeLoginForm: (loginForm: LoginForm) => any,
};

type FieldLocation = {
  fieldIndex: number,
  rowIndex: number,
};

type DataRow =
  | {
      field: LoginField,
      location: FieldLocation,
      row: LoginRow,
      type: 'LOGIN_FORM_FIELD',
    }
  | {
      type: 'FORGOT_PASSWORD',
      url: string,
    }
  | {
      label: string,
      rowIndex: number,
      type: 'ROW_LABEL',
    };

export default class YodleeLoginForm extends Component<Props> {
  render() {
    return (
      <FlatList
        data={this._getData()}
        keyExtractor={(_, index) => String(index)}
        keyboardShouldPersistTaps="always"
        renderItem={this._renderDataRow}
      />
    );
  }

  _renderDataRow = ({ item }: { item: DataRow }) => {
    if (item.type === 'LOGIN_FORM_FIELD') {
      switch (item.field.type) {
        case 'text':
        case 'password':
          return this._renderFieldTextOrPassword(
            item.field,
            item.row,
            item.location,
          );
        case 'option':
          return this._renderFieldOption(item.field, item.location);
        default:
          invariant(false, 'Unhandled yodlee login field: %s', item.field.type);
      }
    } else if (item.type === 'FORGOT_PASSWORD') {
      invariant(false, 'FORGOT PASSWORD NOT YET SUPPORTED');
    } else if (item.type === 'ROW_LABEL') {
      return this._renderRowLabel(item.label);
    } else {
      invariant(false, 'Unrecognized data row: %s', item.type);
    }
  };

  _renderRowLabel(label: string) {
    return (
      <Text style={[TextDesign.normalWithEmphasis, styles.rowLabel]}>
        {label}
      </Text>
    );
  }

  _renderFieldTextOrPassword(
    field: LoginField$TextOrPassword,
    row: LoginRow,
    location: FieldLocation,
  ) {
    return (
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={location.rowIndex === 0 && location.fieldIndex === 0}
        editable={this.props.isEditable}
        onChangeText={text => this._onChangeFormTextValue(location, text)}
        placeholder={row.label}
        secureTextEntry={field.type === 'password'}
        style={styles.fieldTextOrPassword}
        value={field.value}
      />
    );
  }

  _renderFieldOption(field: LoginField$Option, location: FieldLocation) {
    return (
      <View style={styles.fieldOption}>
        {field.option.map((option, index) => (
          <View key={index} style={styles.fieldOptionItemContainer}>
            <TouchableOpacity
              key={index}
              onPress={() =>
                this._onPressFieldOptionItem(field, location, index)
              }
            >
              <View style={styles.fieldOptionItem}>
                <Text style={[styles.fieldOptionItemText, TextDesign.normal]}>
                  {option.displayText}
                </Text>
                {option.isSelected ? (
                  <Image
                    resizeMode="contain"
                    source={Icons.Checkmark}
                    style={styles.checkmarkIcon}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  }

  _onChangeFormTextValue = (location: FieldLocation, text: string): void => {
    const loginForm = this._updateValue(location, text);
    this.props.onChangeLoginForm(loginForm);
  };

  _onPressFieldOptionItem = (
    field: LoginField$Option,
    location: FieldLocation,
    optionIndex: number,
  ): void => {
    const loginForm = this._updateValue(
      location,
      field.option[optionIndex].optionValue,
    );
    this.props.onChangeLoginForm(loginForm);
  };

  _updateValue(location: FieldLocation, value: string): LoginForm {
    const prevLoginForm = this.props.loginForm;

    // Update field.
    // $FlowFixMe - The type does not need to be precise.
    let newField: LoginField$General = {
      ...prevLoginForm.row[location.rowIndex].field[location.fieldIndex],
      value,
    };

    if (newField.type === 'option') {
      // If the field type is 'option', then in addition to setting the value on
      // the field, we need to indicate which option is selected in the set
      // of option objects.
      const newOptions = newField.option.map(option => ({
        ...option,
        isSelected: option.optionValue === value,
      }));
      newField = { ...newField, option: newOptions };
    }

    const field = prevLoginForm.row[location.rowIndex].field.slice();
    field.splice(location.fieldIndex, 1, newField);

    // Update row.
    // $FlowFixMe - This is correct. Flow does not like spread on exact types.
    const newRow: LoginRow = {
      ...prevLoginForm.row[location.rowIndex],
      field,
    };
    const row = prevLoginForm.row.slice();
    row.splice(location.rowIndex, 1, newRow);

    // Update form.
    // $FlowFixMe - This is correct. Flow does not like spread on exact types.
    const newLoginForm: LoginForm = {
      ...this.props.loginForm,
      row: row,
    };

    // Submit
    return newLoginForm;
  }

  _getData() {
    const { loginForm } = this.props;
    const data = [];
    loginForm.row.forEach((row, rowIndex) => {
      if (loginForm.formType === 'questionAndAnswer') {
        data.push({ label: row.label, rowIndex, type: 'ROW_LABEL' });
      }
      row.field.forEach((field, fieldIndex) => {
        data.push({
          field,
          location: { fieldIndex, rowIndex },
          row,
          type: 'LOGIN_FORM_FIELD',
        });
      });
    });
    return data;
  }
}

const styles = StyleSheet.create({
  checkmarkIcon: {
    height: 20,
    width: 20,
  },

  fieldOption: {
    backgroundColor: Colors.BACKGROUND_LIGHT,
    borderColor: Colors.BORDER,
    borderTopWidth: 1,
    marginBottom: 16,
    marginHorizontal: 4,
  },

  fieldOptionItem: {
    alignItems: 'center',
    backgroundColor: Colors.BACKGROUND_LIGHT,
    flex: 1,
    flexDirection: 'row',
    height: 44,
    marginHorizontal: 8,
  },

  fieldOptionItemContainer: {
    borderColor: Colors.BORDER,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },

  fieldOptionItemText: {
    flex: 1,
  },

  fieldTextOrPassword: {
    borderBottomWidth: 1,
    borderColor: Colors.BORDER,
    fontFamily: TextDesign.thickFont,
    fontSize: TextDesign.largeFontSize,
    marginBottom: 24,
    marginHorizontal: 24,
    paddingBottom: 4,
  },

  rowLabel: {
    alignItems: 'center',
    marginBottom: 4,
    marginHorizontal: 8,
    textAlign: 'center',
  },
});
