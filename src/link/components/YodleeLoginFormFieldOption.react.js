/* @flow */

import * as React from 'react';
import Icons from '../../design/icons';

import { GetTheme } from '../../design/components/Theme.react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type {
  LoginField$Option,
  LoginFieldOptionItem,
} from 'common/types/yodlee-v1.0';

export type Props = {
  onSelectItem: (item: LoginFieldOptionItem, index: number) => void,
  option: LoginField$Option,
};

export default class YodleeLoginFormFieldOption extends React.Component<Props> {
  render() {
    const { option } = this.props;

    return (
      <GetTheme>
        {theme => (
          <View
            style={[styles.root, { borderColor: theme.color.borderNormal }]}
          >
            {option.option.map((optionItem, index) => (
              <View
                key={index}
                style={[
                  styles.itemContainer,
                  { borderColor: theme.color.borderNormal },
                ]}
              >
                <TouchableOpacity
                  key={index}
                  onPress={() => this.props.onSelectItem(optionItem, index)}
                >
                  <View
                    style={[
                      styles.item,
                      {
                        backgroundColor: theme.color.backgroundListItem,
                      },
                    ]}
                  >
                    <Text style={[styles.itemText, theme.getTextStyleNormal()]}>
                      {optionItem.displayText}
                    </Text>
                    {optionItem.isSelected === 'true' ? (
                      <Image
                        resizeMode="contain"
                        source={Icons.Checkmark}
                        style={styles.checkmarkIcon}
                      />
                    ) : null}
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </GetTheme>
    );
  }
}

const styles = StyleSheet.create({
  checkmarkIcon: {
    height: 20,
    width: 20,
  },

  item: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    height: 44,
    paddingHorizontal: 8,
  },

  itemContainer: {
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },

  itemText: {
    flex: 1,
  },

  root: {
    borderTopWidth: 1,
    marginBottom: 16,
    marginHorizontal: 4,
  },
});
