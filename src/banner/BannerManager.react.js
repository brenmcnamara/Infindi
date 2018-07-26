/* @flow */

import BannerComponent from './BannerComponent.react';
import React, { Component } from 'react';

import { connect } from 'react-redux';

import type { Banner, BannerChannel } from './types';
import type { ReduxProps, ReduxState } from '../store';

type ComponentProps = {
  channels: Array<BannerChannel>,
  managerKey: 'string',
};

type CalculatedProps = {
  mostImportantBanner: Banner | null,
};

export type Props = ReduxProps & ComponentProps & CalculatedProps;

/**
 * Renders and manager banners that are registered under the set of channels.
 */
class BannerManager extends Component<Props> {
  render() {
    return (
      <BannerComponent
        banner={this.props.mostImportantBanner}
        key={this.props.managerKey}
      />
    );
  }
}

function mapReduxStateToProps(state: ReduxState, props: ComponentProps) {
  const { bannerQueue } = state.banner;
  const { channels } = props;
  return {
    mostImportantBanner:
      bannerQueue.find(banner => channels.includes(banner.bannerChannel)) ||
      null,
  };
}

export default connect(mapReduxStateToProps)(BannerManager);
