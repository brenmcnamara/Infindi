/* @flow */

import React, { Component } from 'react';
import TextButton from '../../components/shared/TextButton.react';
import Themes from '../../design/themes';

import invariant from 'invariant';

import { StyleSheet, View } from 'react-native';

type ButtonLayout = ButtonLayout$LeftAndRight | ButtonLayout$Center;

type ButtonLayout$LeftAndRight = {|
  +isLeftButtonDisabled?: boolean,
  +isRightButtonDisabled?: boolean,
  +leftButtonText: string,
  +rightButtonText: string,
  +type: 'LEFT_AND_RIGHT',
|};

type ButtonLayout$Center = {|
  +centerButtonText: string,
  +isCenterButtonDisabled?: boolean,
  +type: 'CENTER',
|};

export type Props = {
  buttonLayout: ButtonLayout,
  onPress: (button: 'LEFT' | 'RIGHT' | 'CENTER') => any,
};

export type DefaultProps = {
  shouldShowCallToAction: boolean,
};

export default class Footer extends Component<Props> {
  render() {
    const theme = Themes.primary;
    return (
      <View style={[styles.root, { borderColor: theme.color.borderNormal }]}>
        {this.props.buttonLayout.type === 'LEFT_AND_RIGHT'
          ? this._renderLeftAndRightButtons(this.props)
          : this._renderCenterButton(this.props)}
      </View>
    );
  }

  _renderLeftAndRightButtons(props: Props) {
    const { buttonLayout } = props;
    invariant(
      buttonLayout.type === 'LEFT_AND_RIGHT',
      'Incorrect button layout type',
    );
    return (
      <View style={styles.container}>
        <TextButton
          isDisabled={buttonLayout.isLeftButtonDisabled || false}
          onPress={() => props.onPress('LEFT')}
          size="LARGE"
          text={buttonLayout.leftButtonText}
          type="NORMAL"
        />
        <View style={styles.buttonSpacer} />
        <TextButton
          isDisabled={buttonLayout.isRightButtonDisabled || false}
          onPress={() => props.onPress('RIGHT')}
          size="LARGE"
          text={buttonLayout.rightButtonText}
          type="PRIMARY"
        />
      </View>
    );
  }

  _renderCenterButton(props: Props) {
    const { buttonLayout } = props;
    invariant(buttonLayout.type === 'CENTER', 'Incorrect button layout type');
    return (
      <View style={styles.container}>
        <TextButton
          isDisabled={buttonLayout.isCenterButtonDisabled || false}
          layoutType="FILL_PARENT"
          onPress={() => props.onPress('CENTER')}
          size="LARGE"
          text={buttonLayout.centerButtonText}
          type="NORMAL"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonSpacer: {
    flex: 1,
  },

  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },

  root: {
    borderTopWidth: 1,
    height: 50,
    paddingHorizontal: 16,
  },
});
