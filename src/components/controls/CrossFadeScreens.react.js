/* @flow */

import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';

import invariant from 'invariant';

import { Animated, Dimensions } from 'react-native';

export type Props = {
  children?: ?any,
  transitionKey: string,
};

type TransitionStage =
  | {| +props: Props, +type: 'STEADY' |}
  | {| +from: Props, to: Props, +type: 'TRANSITIONING' |};

type State = {
  stage: TransitionStage,
};

export default class CrossFadeScreens extends Component<Props, State> {
  state: State;

  _isTransitioning: boolean = false;
  _markSteadyAsStale: boolean = false;
  _transition: Animated.Value = new Animated.Value(1.0);
  _transitionOp: Promise<void> = Promise.resolve();

  constructor(props: Props) {
    super(props);
    this.state = {
      stage: { props, type: 'STEADY' },
    };
  }

  componentWillUnmount(): void {
    this._isTransitioning = false;
  }

  componentWillReceiveProps(nextProps: Props): void {
    const currentProps = this.props;
    const didChangeKey = currentProps.transitionKey !== nextProps.transitionKey;
    if (didChangeKey) {
      this._markSteadyAsStale = true;
      this._transitionOp = this._transitionOp
        .then(() => this._genTransition(currentProps, nextProps))
        .then(() => {
          this._markSteadyAsStale = false;
        })
        .catch(error => {
          this._markSteadyAsStale = false;
        });
      return;
    }

    const { stage } = this.state;
    switch (stage.type) {
      case 'STEADY':
        this.setState({
          stage: { props: nextProps, type: 'STEADY' },
        });
        break;

      case 'TRANSITIONING':
        this.setState({
          stage: { from: stage.from, to: nextProps, type: 'TRANSITIONING' },
        });
        break;

      default:
        invariant(false, 'Unrecognized transition stage: %s', stage.type);
    }
  }

  render() {
    const { height, width } = Dimensions.get('window');
    const { stage } = this.state;
    const coreAnimatedStyles = {
      height,
      left: 0,
      position: 'absolute',
      top: 0,
      width,
    };

    switch (stage.type) {
      case 'STEADY':
        return (
          <Animated.View
            key={stage.props.transitionKey}
            style={coreAnimatedStyles}
          >
            <CrossFadeChild isStale={this._markSteadyAsStale}>
              {this._renderScreen(stage.props)}
            </CrossFadeChild>
          </Animated.View>
        );

      case 'TRANSITIONING':
        return (
          <Fragment>
            <Animated.View
              key={stage.to.transitionKey}
              style={coreAnimatedStyles}
            >
              <CrossFadeChild isStale={true}>
                {this._renderScreen(stage.to)}
              </CrossFadeChild>
            </Animated.View>
            <Animated.View
              key={stage.from.transitionKey}
              style={[coreAnimatedStyles, { opacity: this._transition }]}
            >
              <CrossFadeChild isStale={true}>
                {this._renderScreen(stage.from)}
              </CrossFadeChild>
            </Animated.View>
          </Fragment>
        );

      default:
        invariant(false, 'Unrecognized transition stage: %s', stage.type);
    }
  }

  _renderScreen(props: Props) {
    return React.Children.only(props.children);
  }

  async _genTransition(from: Props, to: Props): Promise<void> {
    const { stage } = this.state;

    const genStartTransition = () => {
      return new Promise(resolve => {
        invariant(
          stage.type === 'STEADY',
          'Can only start a transition from the steady state',
        );
        invariant(
          !this._isTransitioning,
          'Trying to transition while transition is already happening',
        );
        this._isTransitioning = true;
        this._transition.setValue(1.0);
        this.setState(
          {
            stage: { from, to, type: 'TRANSITIONING' },
          },
          () => {
            resolve();
          },
        );
      });
    };

    const genPerformAnimation = () => {
      return new Promise(resolve => {
        if (!this._isTransitioning) {
          resolve();
          return;
        }
        Animated.timing(this._transition, {
          duration: 200,
          toValue: 0,
          useNativeDriver: true,
        }).start(() => {
          resolve();
        });
      });
    };

    const genEndTransition = () => {
      return new Promise(resolve => {
        if (!this._isTransitioning) {
          resolve();
          return;
        }
        this.setState(
          {
            stage: { props: to, type: 'STEADY' },
          },
          () => {
            this._isTransitioning = false;
            resolve();
          },
        );
      });
    };

    await genStartTransition();
    await genPerformAnimation();
    await genEndTransition();
  }
}

type CrossFadeChildProps = {
  children?: ?any,
  isStale: boolean,
};

class CrossFadeChild extends Component<CrossFadeChildProps> {
  getChildContext() {
    console.log('getting child context', this.props.isStale);
    return { isStale: this.props.isStale };
  }

  render() {
    return this.props.children;
  }
}

CrossFadeChild.childContextTypes = {
  isStale: PropTypes.bool,
};
