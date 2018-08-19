/* @flow */

import React, { Component } from 'react';

import invariant from 'invariant';

import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GetTheme } from '../design/components/Theme.react';

import type { Banner } from './types';
import type { ID } from 'common/types/core';

export type Props = {
  banner: Banner | null,
};

type TransitionState =
  | {| +type: 'EMPTY' |}
  | {|
      +banner: Banner,
      +type: 'IN',
    |}
  | {|
      +banner: Banner,
      +from: 'PREVIOUS_BANNER' | 'EMPTY',
      +type: 'TRANSITION_IN',
    |}
  | {|
      +banner: Banner,
      +to: 'NEXT_BANNER' | 'EMPTY',
      +type: 'TRANSITION_OUT',
    |};

type State = {
  transition: TransitionState,
};

export const TRANSITION_OUT_MILLIS = 300;
export const TRANSITION_IN_MILLIS = 300;

const BANNER_CONTENT_PADDING = 5;
const TEXT_LINE_HEIGHT = 22;
const BANNER_HEIGHT = TEXT_LINE_HEIGHT + 2 * BANNER_CONTENT_PADDING;

export default class BannerComponent extends Component<Props, State> {
  _currentTransitionID: ID = 'request-0';
  _height: Animated.Value;
  _initialBannerTimeoutID: TimeoutID | null = null;
  _transitionIDNumber: number = 1;

  constructor(props: Props) {
    super(props);
    this._height = new Animated.Value(0);
    this.state = {
      transition: { type: 'EMPTY' },
    };
  }

  componentDidMount(): void {
    const { banner } = this.props;
    if (banner) {
      this._initialBannerTimeoutID = setTimeout(() => {
        this._genPerformBannerTransition(null, banner);
        this._initialBannerTimeoutID = null;
      }, 300);
    }
  }

  componentWillReceiveProps(nextProps: Props): void {
    this._initialBannerTimeoutID && clearTimeout(this._initialBannerTimeoutID);
    this._initialBannerTimeoutID = null;

    const prevBanner = this.props.banner;
    const nextBanner = nextProps.banner;
    this._genPerformBannerTransition(prevBanner, nextBanner);
  }

  componentWillUnmount(): void {
    this._initialBannerTimeoutID && clearTimeout(this._initialBannerTimeoutID);
    this._initialBannerTimeoutID = null;
  }

  render() {
    const banner = this._getBanner();
    if (!banner) {
      return null;
    }
    const { transition } = this.state;
    const shouldMaintainHeight =
      (transition.type === 'TRANSITION_IN' &&
        transition.from === 'PREVIOUS_BANNER') ||
      (transition.type === 'TRANSITION_OUT' && transition.to === 'NEXT_BANNER');
    // If we are dismissing a banner and showing another one immediately, then
    // maintain the height of the banner root so the screen doesn't move up
    // and down.
    const rootStyles = [
      styles.root,
      {
        height: shouldMaintainHeight ? BANNER_HEIGHT : 'auto',
      },
    ];

    return (
      <GetTheme>
        {theme => (
          <View style={rootStyles}>
            <Animated.View
              style={[
                {
                  backgroundColor: theme.getBackgroundColorForBannerType(
                    banner.bannerType,
                  ),
                  height: this._height,
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.banner,
                  {
                    marginTop: this._height.interpolate({
                      inputRange: [0, BANNER_HEIGHT],
                      outputRange: [-BANNER_HEIGHT, 0],
                    }),
                  },
                ]}
              >
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={[
                    styles.text,
                    theme.getTextStyleSmallWithEmphasis(),
                    {
                      color: theme.getTextColorForBannerType(banner.bannerType),
                    },
                  ]}
                >
                  {banner.text}
                </Text>
                {banner.showSpinner ? (
                  <ActivityIndicator
                    color={theme.color.backgroundMain}
                    size="small"
                  />
                ) : null}
              </Animated.View>
            </Animated.View>
          </View>
        )}
      </GetTheme>
    );
  }

  async _genPerformBannerTransition(
    prevBanner: Banner | null,
    nextBanner: Banner | null,
  ): Promise<void> {
    if (isEqualBannerRendering(prevBanner, nextBanner)) {
      return;
    }

    invariant(
      prevBanner || nextBanner,
      'Expecting either previous banner or next banner to exist',
    );

    const transitionID = `request-${this._transitionIDNumber}`;
    this._currentTransitionID = transitionID;
    ++this._transitionIDNumber;

    if (prevBanner) {
      await this._genPerformTransitionOut(
        transitionID,
        prevBanner,
        nextBanner ? 'NEXT_BANNER' : 'EMPTY',
      );
    }

    if (nextBanner && this._currentTransitionID === transitionID) {
      await this._genPerformTransitionIn(
        transitionID,
        nextBanner,
        prevBanner ? 'PREVIOUS_BANNER' : 'EMPTY',
      );
    } else if (this._currentTransitionID === transitionID) {
      this.setState({ transition: { type: 'EMPTY' } });
    }
  }

  _genPerformTransitionOut(
    transitionID: ID,
    banner: Banner,
    to: *,
  ): Promise<void> {
    return new Promise(resolve => {
      this.setState(
        { transition: { banner, to, type: 'TRANSITION_OUT' } },
        () => {
          if (transitionID !== this._currentTransitionID) {
            return;
          }
          Animated.timing(this._height, {
            easing: Easing.out(Easing.cubic),
            duration: TRANSITION_OUT_MILLIS,
            toValue: 0,
          }).start(() => {
            resolve();
          });
        },
      );
    });
  }

  _genPerformTransitionIn(
    transitionID: ID,
    banner: Banner,
    from: *,
  ): Promise<void> {
    return new Promise(resolve => {
      this.setState(
        { transition: { banner, from, type: 'TRANSITION_IN' } },
        () => {
          if (transitionID !== this._currentTransitionID) {
            return;
          }
          Animated.timing(this._height, {
            easing: Easing.out(Easing.cubic),
            duration: TRANSITION_IN_MILLIS,
            toValue: BANNER_HEIGHT,
          }).start(() => {
            resolve();
          });
        },
      );
    });
  }

  _getBanner(): ?Banner {
    const { transition } = this.state;
    switch (transition.type) {
      case 'EMPTY':
        return null;
      case 'IN':
      case 'TRANSITION_IN':
      case 'TRANSITION_OUT':
        return transition.banner;
    }
  }
}

const styles = StyleSheet.create({
  animatedView: {
    alignItems: 'flex-end',
  },

  banner: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    height: BANNER_HEIGHT,
    justifyContent: 'center',
    paddingBottom: BANNER_CONTENT_PADDING,
  },

  root: {},

  text: {
    marginHorizontal: 12,
  },
});

// This checks for equality in how the banners render, not equality from a
// model perspective. Want to know if the banners will look different once they
// are rendered.
function isEqualBannerRendering(b1: Banner | null, b2: Banner | null): boolean {
  return Boolean(
    (!b1 && !b2) ||
      (b1 &&
        b2 &&
        b1.bannerType === b2.bannerType &&
        b1.text === b2.text &&
        b1.showSpinner === b2.showSpinner),
  );
}
