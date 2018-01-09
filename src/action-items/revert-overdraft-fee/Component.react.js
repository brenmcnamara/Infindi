/* @flow */

import BulletPoint from '../BulletPoint.react';
import Footer from '../Footer.react';
import Header from '../Header.react';
import React, { Component } from 'react';
import TextButton from '../../components/shared/TextButton.react';
import TextDesign from '../../design/text';

import { CallToActionText, Template } from './Metadata';
import { connect } from 'react-redux';
import { requestUnimplementedModal } from '../../actions/modal';
import { StyleSheet, Text, View } from 'react-native';

import type { ActionItemComponentProps } from '..';
import type { ReduxProps } from '../../typesDEPRECATED/redux';

export type Props = ReduxProps & ActionItemComponentProps;

class RevertOverdraftFee extends Component<Props> {
  render() {
    return (
      <View style={styles.root}>
        <Header
          canNavigateBack={false}
          onPressBack={() => {}}
          showHairline={false}
          title={Template.title}
        />
        <View style={styles.disclaimer}>
          <Text style={[TextDesign.header3, styles.disclaimerText]}>
            Requesting a fee waiver usually works if you are in good standing
            with the bank
          </Text>
        </View>
        <View style={styles.body}>
          <BulletPoint>
            <Text style={TextDesign.normal}>
              On <Text style={TextDesign.normalWithEmphasis}>June 10</Text>, you
              were charged a{' '}
              <Text style={TextDesign.normalWithCriticalEmphasis}>$35</Text>{' '}
              overdraft fee by Wells Fargo
            </Text>
          </BulletPoint>
          <BulletPoint>
            <Text style={TextDesign.normal}>
              Call to request for your fee to be waived
            </Text>
          </BulletPoint>
          <BulletPoint>
            <Text style={TextDesign.normal}>
              Call as soon as possible for the greatest change of success
            </Text>
          </BulletPoint>
        </View>
        <View style={styles.menu}>
          <View style={styles.menuItem}>
            <TextButton
              onPress={this._onSetAReminder}
              text="Set a Reminder"
              type="SPECIAL"
            />
          </View>
        </View>
        <Footer
          callToActionText={CallToActionText}
          onCallToAction={this._onCall}
          onDismiss={this.props.onNoThanks}
          shouldShowCallToAction={true}
        />
      </View>
    );
  }

  _onCall = (): void => {};

  _onSetAReminder = (): void => {
    this.props.dispatch(requestUnimplementedModal('App Reminders'));
  };
}

export default connect()(RevertOverdraftFee);

const styles = StyleSheet.create({
  body: {
    marginTop: 24,
    flex: 1,
  },

  disclaimer: {
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 24,
  },

  disclaimerText: {
    textAlign: 'center',
  },

  menu: {
    marginVertical: 16,
  },

  menuItem: {
    marginTop: 16,
  },

  root: {
    flex: 1,
  },
});
