/* @flow */

import AuthStateUtils from './auth/StateUtils';
import Content from './shared/components/Content.react';
import LifeCycleActions from './life-cycle/Actions';
import LifeCycleStateUtils from './life-cycle/StateUtils';
import React, { Component } from 'react';
import Screen from './shared/components/Screen.react';
import ThemeComponent, { GetTheme } from './design/components/Theme.react';
import UserInfoStateUtils from './data-model/state-utils/UserInfo';

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
import { dismissModal, RightPaneModalID } from './modal/Actions';

import type UserInfo, { UserInfoCollection } from 'common/lib/models/UserInfo';

import type { ID } from 'common/types/core';
import type { LoadState } from './data-model/types';
import type { ReduxProps, ReduxState } from './store';
import type { Theme } from './design/themes';

export type Props = ReduxProps & ComputedProps & ComponentProps;

type ComponentProps = {
  animateOnMount: boolean,
  show: boolean,
};

type ComputedProps = {
  activeUserID: ID,
  currentUserID: ID,
  userFetchLoadState: LoadState,
  userInfos: UserInfoCollection,
};

const MID_DOT = String.fromCharCode(183);
const PANE_WIDTH = 250;

export const TransitionInMillis = 300;
export const TransitionOutMillis = 300;

class RightPaneScreen extends Component<Props> {
  _isTransitioning: boolean = false;
  _transitionProgress = new Animated.Value(0);

  componentWillMount(): void {
    if (this.props.show && !this.props.animateOnMount) {
      this._transitionProgress.setValue(1);
    }
  }

  componentDidMount(): void {
    if (this.props.show && this.props.animateOnMount) {
      this._isTransitioning = true;
      Animated.timing(this._transitionProgress, {
        duration: TransitionInMillis,
        easing: Easing.out(Easing.cubic),
        toValue: 1.0,
        useNativeDriver: true,
      }).start(() => {
        this._isTransitioning = false;
      });
    }
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (this.props.show !== nextProps.show) {
      this._isTransitioning = true;
      // TODO: Standardize easing in design module.
      Animated.timing(this._transitionProgress, {
        duration: nextProps.show ? TransitionInMillis : TransitionOutMillis,
        easing: Easing.out(Easing.cubic),
        toValue: nextProps.show ? 1.0 : 0.0,
        useNativeDriver: true,
      }).start(() => {
        this._isTransitioning = false;
      });
    }
  }

  render() {
    const contentStyles = [
      {
        transform: [
          {
            translateX: this._transitionProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [PANE_WIDTH, 0],
            }),
          },
        ],
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
                    { backgroundColor: theme.color.backgroundMain },
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
    if (userInfo.isAdmin) {
      userGroups.push('ADMIN');
    }
    if (userInfo.isTestUser) {
      userGroups.push('TEST USER');
    }
    if (userGroups.length === 0) {
      userGroups.push('NORMAL USER');
    }

    return (
      <View
        key={`USER-${userInfo.id}`}
        style={[
          styles.listItemRoot,
          {
            backgroundColor:
              this.props.activeUserID === userInfo.id
                ? theme.color.backgroundListItem
                : null,
            borderColor: theme.color.borderNormal,
          },
        ]}
      >
        <TouchableOpacity onPress={() => this._onPressUserInfo(userInfo)}>
          <View style={styles.listItemContent}>
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

  _renderExitButton(theme: Theme) {
    return (
      <View
        key="EXIT"
        style={[styles.listItemRoot, { borderColor: theme.color.borderNormal }]}
      >
        <TouchableOpacity onPress={this._onPressExitWatchSession}>
          <View style={styles.listItemContentLarge}>
            <Text style={theme.getTextStyleNormalWithEmphasis()}>
              Exit Watch Session
            </Text>
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
    if (this.props.show) {
      this.props.dispatch(LifeCycleActions.enterWatchSession(userInfo.id));
      this.props.dispatch(dismissModal(RightPaneModalID));
    }
  };

  _onPressExitWatchSession = (): void => {
    if (this.props.show) {
      this.props.dispatch(LifeCycleActions.exitWatchSession());
      this.props.dispatch(dismissModal(RightPaneModalID));
    }
  };

  _getData(theme: Theme) {
    const {
      activeUserID,
      currentUserID,
      userFetchLoadState,
      userInfos,
    } = this.props;

    const data = [this._renderHeader(theme)];
    if (
      userFetchLoadState.type === 'LOADING' ||
      userFetchLoadState.type === 'EMPTY'
    ) {
      data.push(this._renderSpinner(theme));
    }

    let isFirstUserInfo = true;
    userInfos.forEach(userInfo => {
      if (currentUserID !== userInfo.id) {
        data.push(this._renderUserInfo(theme, userInfo, isFirstUserInfo));
      }
      isFirstUserInfo = false;
    });

    if (activeUserID !== currentUserID) {
      // Currently in watch session.
      data.push(this._renderExitButton(theme));
    }

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

  listItemContent: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },

  listItemContentLarge: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },

  listItemRoot: {
    borderBottomWidth: 1,
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
});

function mapReduxStateToProps(reduxState: ReduxState) {
  return {
    activeUserID: LifeCycleStateUtils.getActiveUserID(reduxState),
    currentUserID: AuthStateUtils.getUserID(reduxState),
    userFetchLoadState: LifeCycleStateUtils.getUserFetchLoadState(reduxState),
    userInfos: UserInfoStateUtils.getCollection(reduxState),
  };
}

export default connect(mapReduxStateToProps)(RightPaneScreen);
