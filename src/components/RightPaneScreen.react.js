/* @flow */

import Content from './shared/Content.react';
import React, { Component } from 'react';
import Screen from './shared/Screen.react';
import ThemeComponent, { GetTheme } from '../design/components/Theme.react';
import WatchSessionActions from '../watch-session/actions';

import {
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { dismissModal, RightPaneModalID } from '../actions/modal';
import { getUserID } from '../auth/state-utils';

import type { ID } from 'common/types/core';
import type { LoadStatus, UserInfoContainer } from '../data-model/types';
import type { ReduxProps, ReduxState } from '../typesDEPRECATED/redux';
import type { Theme } from '../design/themes';
import type { UserInfo } from 'common/lib/models/UserInfo';

export type Props = ReduxProps & ComputedProps & ComponentProps;

type ComponentProps = {
  show: boolean,
};

type ComputedProps = {
  currentUserID: ID,
  userInfoContainer: UserInfoContainer,
  userInfoLoadStatus: LoadStatus,
};

const MID_DOT = String.fromCharCode(183);
const PANE_WIDTH = 250;

export const TransitionInMillis = 300;
export const TransitionOutMillis = 300;

class RightPaneScreen extends Component<Props> {
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
        marginRight: this._transitionProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [-PANE_WIDTH, 0],
        }),
      },
      styles.content,
    ];
    return (
      <View style={styles.root}>
        <TouchableWithoutFeedback onPress={this._onPressBackground}>
          <View style={styles.background} />
        </TouchableWithoutFeedback>
        <Animated.View style={contentStyles}>
          {this._renderScreen()}
        </Animated.View>
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

  _renderHeader(theme: Theme) {
    return (
      <View
        key="HEADER"
        style={[styles.headerRoot, { borderColor: theme.color.borderNormal }]}
      >
        <Text
          style={[
            theme.getTextStyleHeader3(),
            { color: theme.color.textFaint },
          ]}
        >
          USERS
        </Text>
      </View>
    );
  }

  _renderSpinner(theme: Theme) {
    return (
      <View key="SPINNER" style={styles.spinnerRoot}>
        <ActivityIndicator size="small" color="#EFEFEF" />
      </View>
    );
  }

  _renderUserInfo(theme: Theme, userInfo: UserInfo, isFirst: boolean) {
    const userGroups = [];
    if (userInfo.isTestUser) {
      userGroups.push('TEST USER');
    }
    if (userInfo.isAdmin) {
      userGroups.push('ADMIN');
    }
    return (
      <View
        key={`USER-${userInfo.id}`}
        style={[styles.userInfoRoot, { borderColor: theme.color.borderNormal }]}
      >
        <TouchableOpacity onPress={() => this._onPressUserInfo(userInfo)}>
          <View style={styles.userInfoContent}>
            <View style={{ marginBottom: 6 }}>
              <Text style={theme.getTextStyleNormalWithEmphasis()}>
                {`${userInfo.firstName} ${userInfo.lastName}`}
              </Text>
            </View>
            {userGroups.length > 0 ? (
              <View>
                <Text
                  style={[
                    theme.getTextStyleTiny(),
                    { color: theme.color.textPrimary },
                  ]}
                >
                  {userGroups.join(` ${MID_DOT} `)}
                </Text>
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  _onPressBackground = (): void => {
    if (!this._isTransitioning && this.props.show) {
      this.props.dispatch(dismissModal(RightPaneModalID));
    }
  };

  _onPressUserInfo = (userInfo: UserInfo): void => {
    this.props.dispatch(WatchSessionActions.enterWatchSession(userInfo.id));
    this.props.dispatch(dismissModal(RightPaneModalID));
  };

  _getData(theme: Theme) {
    const { currentUserID, userInfoLoadStatus, userInfoContainer } = this.props;
    const data = [this._renderHeader(theme)];
    if (userInfoLoadStatus === 'LOADING') {
      data.push(this._renderSpinner(theme));
    }

    Object.values(userInfoContainer).forEach(
      // $FlowFixMe - Entries will always be UserInfo.
      (userInfo: UserInfo, index: number) => {
        if (currentUserID !== userInfo.id) {
          data.push(this._renderUserInfo(theme, userInfo, index === 0));
        }
      },
    );

    return data;
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  content: {
    width: PANE_WIDTH,
  },

  headerRoot: {
    borderBottomWidth: 1,
    marginTop: 50,
    paddingBottom: 8,
    paddingLeft: 12,
  },

  listContainer: {
    flex: 1,
  },

  root: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  spinnerRoot: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },

  userInfoContent: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },

  userInfoRoot: {
    borderBottomWidth: 1,
  },
});

function mapReduxStateToProps(state: ReduxState) {
  return {
    currentUserID: getUserID(state),
    userInfoContainer: state.userInfo.container,
    userInfoLoadStatus: state.userInfo.loadStatus,
  };
}

export default connect(mapReduxStateToProps)(RightPaneScreen);