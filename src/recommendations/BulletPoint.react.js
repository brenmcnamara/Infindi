/* @flow */

import Colors from '../design/colors';
import React from 'react';

import { StyleSheet, View } from 'react-native';

const BULLET_SIZE = 6;

export default function(props: { children?: ?any }) {
  return (
    <View style={styles.root}>
      <View style={styles.bulletPointContainer}>
        <View style={styles.bulletPoint} />
      </View>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 12,
    marginHorizontal: 24,
  },

  bulletPoint: {
    backgroundColor: Colors.TEXT_NORMAL,
    borderRadius: BULLET_SIZE / 2,
    height: BULLET_SIZE,
    width: BULLET_SIZE,
  },

  bulletPointContainer: {
    height: 22, // Line height of text
    justifyContent: 'center',
    marginRight: 12,
  },
});
