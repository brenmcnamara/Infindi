/* @flow */

import Colors from '../../design/colors';
import React, { Component } from 'react';
import TextButton from '../../components/shared/TextButton.react';
import TextDesign from '../../design/text';

import { StyleSheet, Text, View } from 'react-native';

const BULLET_SIZE = 6;

export type Props = {
  onContribute: () => any,
  onLearnMoreAboutHSAs: () => any,
  onNoThanks: () => any,
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
          <Bullet>
            <Text style={TextDesign.normal}>
              Contributions are tax deductible
            </Text>
          </Bullet>
          <Bullet>
            <Text style={TextDesign.normal}>
              Gains and withdrawals are tax free
            </Text>
          </Bullet>
          <Bullet>
            <Text style={TextDesign.normal}>
              Applies to medical expenses for yourself, your spouse, and your
              children
            </Text>
          </Bullet>
          <Bullet>
            <Text style={TextDesign.normal}>
              Grow your investment over time
            </Text>
          </Bullet>
          <Bullet>
            <Text style={TextDesign.normal}>
              Only applies to high-deductible health plans (HDHPs)
            </Text>
          </Bullet>
        </View>
        <View style={styles.menu}>
          <TextButton
            onPress={this.props.onLearnMoreAboutHSAs}
            text="Learn more about HSAs"
            type="SPECIAL"
          />
        </View>
        <View style={styles.footer}>
          <TextButton
            onPress={this.props.onNoThanks}
            size="LARGE"
            text="NO THANKS"
            type="NORMAL"
          />
          <View style={styles.buttonSpacer} />
          <TextButton
            onPress={this.props.onContribute}
            size="LARGE"
            text="CONTRIBUTE"
            type="PRIMARY"
          />
        </View>
      </View>
    );
  }
}

const Bullet = (props: { children?: ?any }) => (
  <View style={styles.bullet}>
    <View style={styles.bulletPointContainer}>
      <View style={styles.bulletPoint} />
    </View>
    {props.children}
  </View>
);

const styles = StyleSheet.create({
  bullet: {
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

  bullets: {
    flex: 1,
    marginTop: 16,
  },

  buttonSpacer: {
    flex: 1,
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

  footer: {
    alignItems: 'center',
    borderColor: Colors.BORDER,
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 60,
    paddingHorizontal: 8,
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
