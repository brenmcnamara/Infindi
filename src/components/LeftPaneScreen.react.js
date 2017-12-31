/* @flow */

import Colors from '../design/colors';
import Content from './shared/Content.react';
import Icons from '../design/icons';
import React, { Component } from 'react';
import Screen from './shared/Screen.react';
import TextDesign from '../design/text';

import invariant from 'invariant';

import {
  Animated,
  Easing,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { dismissModal } from '../actions/modal';
import { getUserFullName } from '../store/state-utils';
import { logout } from '../actions/authentication';

import type { ReduxProps, ReduxState } from '../typesDEPRECATED/redux';

export type Props = ReduxProps & {
  show: bool,
  userName: string,
};

const LEFT_PANE_WIDTH = 250;

export const TransitionInMillis = 300;
export const TransitionOutMillis = 300;

class LeftPaneScreen extends Component<Props> {
  _transitionProgress: Animated.Value;

  constructor(props: Props) {
    super(props);
    this._transitionProgress = new Animated.Value(props.show ? 1 : 0);
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (this.props.show !== nextProps.show) {
      // TODO: Standardize easing in design module.
      Animated.timing(this._transitionProgress, {
        duration: nextProps.show ? TransitionInMillis : TransitionOutMillis,
        easing: Easing.out(Easing.cubic),
        toValue: nextProps.show ? 1.0 : 0.0,
      }).start();
    }
  }

  render() {
    const contentStyles = [
      {
        marginLeft: this._transitionProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [-LEFT_PANE_WIDTH, 0],
        }),
      },
      styles.content,
    ];
    return (
      <View style={styles.root}>
        <Animated.View style={contentStyles}>
          {this._renderScreen()}
        </Animated.View>
        <TouchableWithoutFeedback onPress={this._onPressBackground}>
          <View style={styles.background} />
        </TouchableWithoutFeedback>
      </View>
    );
  }

  _renderScreen() {
    // TODO: Set coloring themes for different types of screens. Would like
    // this screen to have a light background with adding a child element.
    return (
      <Screen>
        <Content>
          <View style={styles.listContainer}>
            <FlatList
              automaticallyAdjustContentInsets={false}
              data={this._getData()}
              renderItem={({ item }) => item}
            />
          </View>
        </Content>
      </Screen>
    );
  }

  _renderUserProfile() {
    return (
      <View key="user-profile" style={styles.userProfileRoot}>
        <Image
          resizeMode="contain"
          source={Icons.UserMale}
          style={styles.userProfileIcon}
        />
        <Text style={[TextDesign.normalWithEmphasis, styles.userProfileTitle]}>
          {this.props.userName}
        </Text>
      </View>
    );
  }

  _renderSignOut() {
    return (
      <TouchableOpacity
        key="sign-out"
        onPress={this._onPressSignOut}
        style={styles.signOutRoot}
      >
        <Image
          resizeMode="contain"
          source={Icons.Power}
          style={styles.signOutIcon}
        />
        <Text style={[TextDesign.normal, styles.signOutTitle]}>Sign Out</Text>
      </TouchableOpacity>
    );
  }

  _onPressBackground = (): void => {
    if (this.props.show) {
      this.props.dispatch(dismissModal('LEFT_PANE'));
    }
  };

  _onPressSignOut = (): void => {
    if (this.props.show) {
      this.props.dispatch(logout());
      this.props.dispatch(dismissModal('LEFT_PANE'));
    }
  };

  _getData() {
    return [this._renderUserProfile(), this._renderSignOut()];
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  content: {
    shadowColor: 'black',
    shadowOffset: { height: 1, width: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    width: LEFT_PANE_WIDTH,
  },

  listContainer: {
    backgroundColor: Colors.BACKGROUND_LIGHT,
    flex: 1,
  },

  root: {
    flex: 1,
    flexDirection: 'row',
  },

  signOutIcon: {
    height: 22,
    marginLeft: 8,
    width: 22,
  },

  signOutRoot: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 44,
  },

  signOutTitle: {
    marginLeft: 8,
  },

  userProfileIcon: {
    marginLeft: 8,
    width: 22,
  },

  userProfileRoot: {
    alignItems: 'flex-end',
    borderColor: Colors.BORDER,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 70,
    paddingBottom: 8,
  },

  userProfileTitle: {
    marginLeft: 8,
  },
});

function mapReduxStateToProps(state: ReduxState) {
  console.log('RE-RENDERING LEFT PANE SCREEN', state.authStatus.type);
  const userName = getUserFullName(state);
  invariant(userName, 'User must have login payload for left pane to show');
  return {
    userName,
  };
}

export default connect(mapReduxStateToProps)(LeftPaneScreen);
