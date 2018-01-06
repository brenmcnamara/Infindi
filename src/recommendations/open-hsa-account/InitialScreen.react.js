/* @flow */

import BulletPoint from '../BulletPoint.react';
import Colors from '../../design/colors';
import React, { Component } from 'react';
import TextButton from '../../components/shared/TextButton.react';
import TextDesign from '../../design/text';

import { StyleSheet, Text, View } from 'react-native';

export type Props = {
  onLearnMoreAboutHSAs: () => any,
};

export default class InitialScreen extends Component<Props> {
  render() {
    return (
      <View style={styles.root}>
        <View style={styles.finAnalysis}>
          <Text style={[TextDesign.header2, styles.finAnalysisText]}>
            X Months Closer to Financial Freedom
          </Text>
        </View>
        <View style={styles.whatIsHSA}>
          <Text style={[TextDesign.header3, styles.whatIsHSAText]}>
            An HSA is a tax-advantaged savings and investment account for
            medical expenses.
          </Text>
        </View>
        <View style={styles.bullets}>
          <BulletPoint>
            <Text style={TextDesign.normal}>
              Contributions are tax deductible
            </Text>
          </BulletPoint>
          <BulletPoint>
            <Text style={TextDesign.normal}>
              Gains and withdrawals are tax free
            </Text>
          </BulletPoint>
          <BulletPoint>
            <Text style={TextDesign.normal}>
              Applies to medical expenses for yourself, your spouse, and your
              children
            </Text>
          </BulletPoint>
          <BulletPoint>
            <Text style={TextDesign.normal}>
              Grow your investment over time
            </Text>
          </BulletPoint>
          <BulletPoint>
            <Text style={TextDesign.normal}>
              Only applies to high-deductible health plans (HDHPs)
            </Text>
          </BulletPoint>
        </View>
        <View style={styles.menu}>
          <TextButton
            onPress={this.props.onLearnMoreAboutHSAs}
            text="Learn more about HSAs"
            type="SPECIAL"
          />
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
