/* @flow */

import React, { Component } from 'react';
import TextButton from './TextButton.react';

import invariant from 'invariant';

import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GetTheme } from '../design/components/Theme.react';

type ButtonLayout =
  | ButtonLayout$LeftAndRight
  | ButtonLayout$Center
  | ButtonLayout$Loading;

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

type ButtonLayout$Loading = {|
  +type: 'LOADING',
|};

export type Props = {
  buttonLayout: ButtonLayout,
  onLongPress?: (button: 'LEFT' | 'RIGHT' | 'CENTER') => void,
  onPress: (button: 'LEFT' | 'RIGHT' | 'CENTER') => void,
};

export type DefaultProps = {
  shouldShowCallToAction: boolean,
};

export default class Footer extends Component<Props> {
  render() {
    return (
      <GetTheme>
        {theme => (
          <View
            style={[styles.root, { borderColor: theme.color.borderNormal }]}
          >
            {this.props.buttonLayout.type === 'LEFT_AND_RIGHT'
              ? this._renderLeftAndRightButtons(this.props)
              : this.props.buttonLayout.type === 'LOADING'
                ? this._renderLoading()
                : this._renderCenterButton(this.props)}
          </View>
        )}
      </GetTheme>
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
          onLongPress={() => props.onLongPress && props.onLongPress('LEFT')}
          onPress={() => props.onPress('LEFT')}
          size="LARGE"
          text={buttonLayout.leftButtonText}
          type="NORMAL"
        />
        <View style={styles.buttonSpacer} />
        <TextButton
          isDisabled={buttonLayout.isRightButtonDisabled || false}
          onLongPress={() => props.onLongPress && props.onLongPress('RIGHT')}
          onPress={() =>  props.onPress('RIGHT')}
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
          onLongPress={() => props.onLongPress && props.onLongPress('CENTER')}
          onPress={() => props.onPress('CENTER')}
          size="LARGE"
          text={buttonLayout.centerButtonText}
          type="NORMAL"
        />
      </View>
    );
  }

  _renderLoading() {
    const { buttonLayout } = this.props;
    invariant(buttonLayout.type === 'LOADING', 'Incorrect button layout type');
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="small" />
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
