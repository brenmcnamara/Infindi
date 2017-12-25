/* @flow */

import Content from './shared/Content.react';
import React, { Component } from 'react';
import RecommendationBanner, {
  WIDTH as RECOMMENDATION_BANNER_WIDTH,
} from './RecommendationBanner.react';
import Screen from './shared/Screen.react';

import { connect } from 'react-redux';
import { ScrollView, StyleSheet, View } from 'react-native';

import { type ReduxProps } from 'redux';

const SPACE_BETWEEN_PAGES = 4;
const HALF_SPACE_BETWEEN_PAGES = SPACE_BETWEEN_PAGES / 2;

export type Props = ReduxProps;

type State = {
  recommendationPage: number,
};

class HomeScreen extends Component<Props, State> {
  state: State = {
    recommendationPage: 0,
  };

  render() {
    return (
      <Screen avoidNavBar={true} avoidTabBar={true}>
        <Content>
          <View style={styles.placeholder} />
          <View style={styles.recommendationContainer}>
            <ScrollView
              alwaysBounceHorizontal={true}
              alwaysBounceVertical={false}
              automaticallyAdjustContentInsets={false}
              contentInset={{
                bottom: 0,
                left: HALF_SPACE_BETWEEN_PAGES,
                right: HALF_SPACE_BETWEEN_PAGES,
                top: 0,
              }}
              contentOffset={{ x: -HALF_SPACE_BETWEEN_PAGES, y: 0 }}
              decelerationRate="fast"
              horizontal={true}
              onScroll={this._onScrollRecommendationPager}
              pagingEnabled={false}
              scrollEventThrottle={11}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              snapToAlignment="center"
              snapToInterval={RECOMMENDATION_BANNER_WIDTH + SPACE_BETWEEN_PAGES}
              style={styles.recommendationPager}
            >
              <Page>
                <RecommendationBanner
                  isFocused={this.state.recommendationPage === 0}
                />
              </Page>
              <Page>
                <RecommendationBanner
                  isFocused={this.state.recommendationPage === 1}
                />
              </Page>
              <Page>
                <RecommendationBanner
                  isFocused={this.state.recommendationPage === 2}
                />
              </Page>
              <Page>
                <RecommendationBanner
                  isFocused={this.state.recommendationPage === 3}
                />
              </Page>
            </ScrollView>
          </View>
        </Content>
      </Screen>
    );
  }

  _onScrollRecommendationPager = (event: Object): void => {
    const offset = event.nativeEvent.contentOffset.x;
    const page = clamp(
      0,
      3,
      Math.round(offset / (RECOMMENDATION_BANNER_WIDTH + SPACE_BETWEEN_PAGES)),
    );
    if (page !== this.state.page) {
      this.setState({ recommendationPage: page });
    }
  };
}

type PageProps = {
  children?: ?any,
  isFirst?: bool,
  isLast?: bool,
};

const Page = (props: PageProps) => {
  return <View style={styles.page}>{props.children}</View>;
};

const styles = StyleSheet.create({
  page: {
    marginHorizontal: HALF_SPACE_BETWEEN_PAGES,
  },

  placeholder: {
    flex: 1,
  },

  recommendationContainer: {},

  recommendationPager: {
    marginBottom: 4,
  },
});

const mapReduxStateToProps = () => ({});

export default connect(mapReduxStateToProps)(HomeScreen);

function clamp(min: number, max: number, val: number): number {
  return Math.min(max, Math.max(min, val));
}
