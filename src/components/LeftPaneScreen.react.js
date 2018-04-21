/* @flow */

import Content from './shared/Content.react';
import Icons from '../design/icons';
import React, { Component } from 'react';
import Screen from './shared/Screen.react';
import ThemeComponent, { GetTheme } from '../design/components/Theme.react';

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
import { dismissModal, LeftPaneModalID } from '../actions/modal';
import { getUserFullName } from '../auth/state-utils';
import { logout } from '../auth/actions';

import type { ReduxProps, ReduxState } from '../store';
import type { Theme } from '../design/themes';

export type Props = ReduxProps & {
  show: boolean,
  userName: string,
};

const LEFT_PANE_WIDTH = 250;

export const TransitionInMillis = 300;
export const TransitionOutMillis = 300;

class LeftPaneScreen extends Component<Props> {
  _isTransitioning: boolean = false;
  _transitionProgress: Animated.Value;

  constructor(props: Props) {
    super(props);
    this._transitionProgress = new Animated.Value(props.show ? 1 : 0);
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (this.props.show !== nextProps.show) {
      this._isTransitioning = true;
      // TODO: Standardize easing in design module.
      Animated.timing(this._transitionProgress, {
        duration: nextProps.show ? TransitionInMillis : TransitionOutMillis,
        easing: Easing.out(Easing.cubic),
        toValue: nextProps.show ? 1.0 : 0.0,
      }).start(() => {
        this._isTransitioning = false;
      });
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
      <ThemeComponent themeName="dark">
        <GetTheme>
          {theme => (
            <Screen>
              <Content>
                <View
                  style={[
                    styles.listContainer,
                    { backgroundColor: theme.color.backgroundApp },
                  ]}
                >
                  <FlatList
                    automaticallyAdjustContentInsets={false}
                    data={this._getData(theme)}
                    renderItem={({ item }) => item}
                  />
                </View>
              </Content>
            </Screen>
          )}
        </GetTheme>
      </ThemeComponent>
    );
  }

  _renderUserProfile(theme: Theme) {
    return (
      <View
        key="user-profile"
        style={[
          styles.userProfileRoot,
          { borderColor: theme.color.borderNormal },
        ]}
      >
        <Image
          resizeMode="contain"
          source={Icons.UserMaleLight}
          style={styles.userProfileIcon}
        />
        <Text
          style={[
            theme.getTextStyleNormalWithEmphasis(),
            styles.userProfileTitle,
          ]}
        >
          {this.props.userName}
        </Text>
      </View>
    );
  }

  _renderSignOut(theme: Theme) {
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
        <Text style={[theme.getTextStyleError(), styles.signOutTitle]}>
          Sign Out
        </Text>
      </TouchableOpacity>
    );
  }

  _onPressBackground = (): void => {
    if (!this._isTransitioning && this.props.show) {
      this.props.dispatch(dismissModal(LeftPaneModalID));
    }
  };

  _onPressSignOut = (): void => {
    if (this.props.show) {
      this.props.dispatch(logout());
      this.props.dispatch(dismissModal(LeftPaneModalID));
    }
  };

  _getData(theme: Theme) {
    return [this._renderUserProfile(theme), this._renderSignOut(theme)];
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  content: {
    // shadowColor: 'black',
    // shadowOffset: { height: 1, width: 2 },
    // shadowOpacity: 0.3,
    // shadowRadius: 3,
    width: LEFT_PANE_WIDTH,
  },

  listContainer: {
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
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 70,
    paddingBottom: 16,
    marginTop: 16,
  },

  userProfileTitle: {
    marginLeft: 8,
  },
});

function mapReduxStateToProps(state: ReduxState) {
  const userName = getUserFullName(state);
  invariant(userName, 'User must have login payload for left pane to show');
  return {
    userName,
  };
}

export default connect(mapReduxStateToProps)(LeftPaneScreen);
