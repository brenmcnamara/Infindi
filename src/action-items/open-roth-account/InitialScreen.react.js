/* @flow */

import BulletPoint from '../BulletPoint.react';
import Colors from '../../design/colors';
import React, { Component } from 'react';
import TextButton from '../../shared/TextButton.react';
import TextDesign from '../../design/text';

import { StyleSheet, Text, View } from 'react-native';
import { Template } from './Metadata';

export type Props = {
  onLearnMoreAbout401k: () => any,
  onWhySaveForRetirement: () => any,
};

export default class InitialScreen extends Component<Props> {
  render() {
    return (
      <View style={styles.root}>
        <View style={styles.finAnalysis}>
          <Text style={[TextDesign.header2, styles.finAnalysisText]}>
            {Template.savingsStatement}
          </Text>
        </View>
        <View style={styles.whatIsHSA}>
          <Text style={[TextDesign.header3, styles.whatIsHSAText]}>
            The first step towards smart, tax-efficient savings
          </Text>
        </View>
        <View style={styles.bullets}>
          <BulletPoint>
            <Text style={TextDesign.normal}>
              No taxes on your investment gains
            </Text>
          </BulletPoint>
          <BulletPoint>
            <Text style={TextDesign.normal}>
              Employers often match a portion of your contributions (this is
              free money!)
            </Text>
          </BulletPoint>
          <BulletPoint>
            <Text style={TextDesign.normal}>
              Based on your financial situation, we recommend a Roth 401k
            </Text>
          </BulletPoint>
        </View>
        <View style={styles.menu}>
          <View style={styles.menuItem}>
            <TextButton
              onPress={this.props.onLearnMoreAbout401k}
              text="Learn more about 401k"
              type="SPECIAL"
            />
          </View>
          <View style={styles.menuItem}>
            <TextButton
              onPress={this.props.onWhySaveForRetirement}
              text="Why should I save for retirement?"
              type="SPECIAL"
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bullets: {
    flex: 1,
    marginTop: 16,
  },

  finAnalysis: {
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 16,
  },

  finAnalysisText: {
    color: Colors.TEXT_PRIMARY,
    textAlign: 'center',
  },

  menu: {
    marginVertical: 16,
  },

  menuItem: {
    marginTop: 16,
  },

  root: {
    backgroundColor: Colors.BACKGROUND,
    flex: 1,
  },

  whatIsHSA: {
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 24,
  },

  whatIsHSAText: {
    textAlign: 'center',
  },
});
