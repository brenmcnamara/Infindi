/* @flow */

import * as React from 'react';

import { GetTheme } from '../../design/components/Theme.react';
import { StyleSheet, Text, View } from 'react-native';

export type Props = {
  text: string,
};

export default class YodleeLoginFormSubheader extends React.Component<Props> {
  render() {
    return (
      <GetTheme>
        {theme => (
          <View style={styles.root}>
            <Text style={[theme.getTextStyleNormalWithEmphasis(), styles.text]}>
              {this.props.text}
            </Text>
          </View>
        )}
      </GetTheme>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    marginBottom: 8,
    marginHorizontal: 8,
  },

  text: {
    textAlign: 'center',
  },
});
