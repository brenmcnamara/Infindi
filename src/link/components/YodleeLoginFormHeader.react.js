/* @flow */

import * as React from 'react';

import { GetTheme } from '../../design/components/Theme.react';
import { StyleSheet, Text, View } from 'react-native';

export type Props = {
  subtitle: string | null,
  title: string | null,
};

export default class YodleeLoginFormHeader extends React.Component<Props> {
  render() {
    const { title, subtitle } = this.props;
    return (
      <GetTheme>
        {theme => (
          <View style={styles.root}>
            {title ? (
              <Text style={[theme.getTextStyleHeader3(), styles.title]}>
                {title}
              </Text>
            ) : null}
            {subtitle ? (
              <Text
                style={[
                  theme.getTextStyleNormalWithEmphasis(),
                  styles.subtitle,
                ]}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>
        )}
      </GetTheme>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    marginBottom: 20,
  },

  subtitle: {
    marginTop: 4,
    textAlign: 'center',
  },

  title: {
    textAlign: 'center',
  },
});
