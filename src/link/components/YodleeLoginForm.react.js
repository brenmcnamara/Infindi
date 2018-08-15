/* @flow */

import React, { Component } from 'react';
import YodleeLoginFormFieldOption from './YodleeLoginFormFieldOption.react';
import YodleeLoginFormHeader from './YodleeLoginFormHeader.react';
import YodleeLoginFormInputField from './YodleeLoginFormInputField.react';
import YodleeLoginFormSubheader from './YodleeLoginFormSubheader.react';

import invariant from 'invariant';

import { FlatList, StyleSheet } from 'react-native';

import type {
  LoginField,
  LoginField$General,
  LoginField$Option,
  LoginForm,
  LoginRow,
} from 'common/types/yodlee-v1.0';

export type Props = {
  enableInteraction: boolean,
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
      subtitle: string | null,
      title: string | null,
      type: 'HEADER',
    }
  | {
      label: string,
      rowIndex: number,
      type: 'SUBHEADER',
    };

export default class YodleeLoginForm extends Component<Props> {
  render() {
    return (
      <FlatList
        data={this._getData()}
        keyExtractor={(_, index) => String(index)}
        keyboardShouldPersistTaps="always"
        renderItem={this._renderDataRow}
        style={styles.root}
      />
    );
  }

  _renderDataRow = ({ item }: { item: DataRow }) => {
    switch (item.type) {
      case 'LOGIN_FORM_FIELD': {
        switch (item.field.type) {
          case 'text':
          case 'password': {
            const { row } = item;
            const { fieldIndex, rowIndex } = item.location;
            return (
              <YodleeLoginFormInputField
                autoFocus={rowIndex === 0 && fieldIndex === 0}
                enableInteraction={this.props.enableInteraction}
                isPassword={item.field.type === 'password'}
                onChangeText={text =>
                  this._onChangeFormTextValue(item.location, text)
                }
                placeholder={row.label.length <= 15 ? row.label : ''}
              />
            );
          }

          case 'option': {
            const { field } = item;
            return (
              <YodleeLoginFormFieldOption
                onSelectItem={(optionItem, index) =>
                  this._onPressFieldOptionItem(field, item.location, index)
                }
                option={field}
              />
            );
          }

          default: {
            return invariant(
              false,
              'Unhandled yodlee login field: %s',
              item.field.type,
            );
          }
        }
      }

      case 'FORGOT_PASSWORD': {
        return invariant(false, 'Forgot password not yet supported');
      }

      case 'HEADER': {
        return (
          <YodleeLoginFormHeader title={item.title} subtitle={item.subtitle} />
        );
      }

      case 'SUBHEADER': {
        return <YodleeLoginFormSubheader text={item.label} />;
      }

      default: {
        return invariant(false, 'Unrecognized data row: %s', item.type);
      }
    }
  };

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
        isSelected: option.optionValue === value ? 'true' : 'false',
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
    if (loginForm.formType === 'questionAndAnswer') {
      const { mfaInfoText, mfaInfoTitle } = loginForm;
      data.push({
        subtitle: mfaInfoText,
        title: mfaInfoTitle,
        type: 'HEADER',
      });
    }

    loginForm.row.forEach((row, rowIndex) => {
      if (loginForm.formType === 'questionAndAnswer' || row.label.length > 15) {
        data.push({ label: row.label, rowIndex, type: 'SUBHEADER' });
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
  root: {
    marginTop: 0,
  },
});
