/* @flow */

import Banner from './Banner.react';
import React, { Component } from 'react';

import { connect } from 'react-redux';

import type { BannerChannel, Toast$Banner } from '../../reducers/toast';
import type { ReduxProps, ReduxState } from '../../typesDEPRECATED/redux';

type ComponentProps = {
  channels: Array<BannerChannel>,
  managerKey: 'string',
};

type CalculatedProps = {
  mostImportantBanner: Toast$Banner | null,
};

export type Props = ReduxProps & ComponentProps & CalculatedProps;

/**
 * Renders and manager banners that are registered under the set of channels.
 */
class BannerManager extends Component<Props> {
  render() {
    return (
      <Banner
        banner={this.props.mostImportantBanner}
        key={this.props.managerKey}
      />
    );
  }
}

function mapReduxStateToProps(state: ReduxState, props: ComponentProps) {
  const { bannerQueue } = state.toast;
  const { channels } = props;
  return {
    mostImportantBanner:
      bannerQueue.find(banner => channels.includes(banner.bannerChannel)) ||
      null,
  };
}

export default connect(mapReduxStateToProps)(BannerManager);
